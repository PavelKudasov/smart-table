import { initData } from './data.js';
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';
import { initTable } from './components/table.js';
import { cloneTemplate } from './lib/utils.js';

let lastPageCount = 1;

function collectState() {
  const form = document.forms.table;
  const state = {};

  const searchInput = form.querySelector('[data-name="search"]');
  const rowsPerPage = form.querySelector('[data-name="rowsPerPage"]');
  const activePage = form.querySelector('[name="page"]:checked');
  const sortByDate = form.querySelector('[data-name="sortByDate"]');
  const sortByTotal = form.querySelector('[data-name="sortByTotal"]');

  if (searchInput) {
    state.search = searchInput.value;
  }

  if (rowsPerPage) {
    state.rowsPerPage = Number(rowsPerPage.value);
  }

  if (activePage) {
    state.page = Number(activePage.value);
  }

  if (sortByDate && sortByDate.dataset.value !== 'none') {
    state.sortField = 'date';
    state.sortOrder = sortByDate.dataset.value;
  }

  if (sortByTotal && sortByTotal.dataset.value !== 'none') {
    state.sortField = 'total';
    state.sortOrder = sortByTotal.dataset.value;
  }

  return state;
}

function bootstrap() {
  const app = document.getElementById('app');
  const api = initData();

  const searchTemplate = cloneTemplate('search');
  const paginationTemplate = cloneTemplate('pagination');

  app.appendChild(searchTemplate.container);

  const tableSettings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter'],
    after: []
  };

  const columns = {
    date: 'date',
    total: 'total'
  };

  let render;

  const onAction = (submitter) => {
    if (!submitter) {
      render();
      return;
    }

    const actionName = submitter.dataset.name;
    const field = submitter.dataset.field;

    if (actionName === 'firstPage') {
      render({ type: 'page', payload: 1 });
      return;
    }

    if (actionName === 'previousPage') {
      render({ type: 'prev' });
      return;
    }

    if (actionName === 'nextPage') {
      render({ type: 'next' });
      return;
    }

    if (actionName === 'lastPage') {
      render({ type: 'page', payload: lastPageCount });
      return;
    }

    if (submitter.name === 'page') {
      render({ type: 'page', payload: Number(submitter.value) });
      return;
    }

    if (actionName === 'sortByDate' || actionName === 'sortByTotal') {
      const currentValue = submitter.dataset.value || 'none';
      const nextValue = currentValue === 'none'
        ? 'up'
        : currentValue === 'up'
          ? 'down'
          : 'none';

      submitter.dataset.value = nextValue;

      const otherActionName = actionName === 'sortByDate'
        ? 'sortByTotal'
        : 'sortByDate';

      const otherButton = document.querySelector(`[data-name="${otherActionName}"]`);

      if (otherButton) {
        otherButton.dataset.value = 'none';
      }

      render({ type: 'page', payload: 1 });
      return;
    }

    if (actionName === 'clear' && field) {
      const input = document.querySelector(`[name="${field}"]`);

      if (input) {
        input.value = '';
      }

      render({ type: 'page', payload: 1 });
      return;
    }

    render({ type: 'page', payload: 1 });
  };

  const sampleTable = initTable(tableSettings, onAction);

  app.appendChild(sampleTable.container);
  app.appendChild(paginationTemplate.container);

  const paginationElements = {
    first: paginationTemplate.elements.firstPage,
    prev: paginationTemplate.elements.previousPage,
    next: paginationTemplate.elements.nextPage,
    last: paginationTemplate.elements.lastPage,
    pages: paginationTemplate.elements.pages,
    rowsPerPage: paginationTemplate.elements.rowsPerPage,
    fromRow: paginationTemplate.elements.fromRow,
    toRow: paginationTemplate.elements.toRow,
    totalRows: paginationTemplate.elements.totalRows
  };

  const filterElements = {
    searchByDate: sampleTable.filter.elements.searchByDate,
    searchByCustomer: sampleTable.filter.elements.searchByCustomer,
    searchBySeller: sampleTable.filter.elements.searchBySeller,
    totalFrom: sampleTable.filter.elements.totalFrom,
    totalTo: sampleTable.filter.elements.totalTo
  };

  const { applyPagination, updatePagination } = initPagination(paginationElements);
  const { applyFiltering, updateIndexes } = initFiltering(filterElements);
  const applySearching = initSearching('search');
  const applySorting = initSorting(columns);

  render = async (action) => {
    const state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);

    lastPageCount = Math.ceil(total / query.limit);

    updatePagination(total, query);
    sampleTable.render(items);
  };

  const init = async () => {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
      searchBySeller: indexes.sellers
    });
  };

  init().then(render);
}

bootstrap();