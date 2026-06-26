import { initData } from './data.js';
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';
import { initTable } from './components/table.js';

document.addEventListener('DOMContentLoaded', async () => {
  const api = initData();

  const table = initTable();
  const pagination = initPagination();
  const filtering = initFiltering();
  const searching = initSearching('search');
  const sorting = initSorting();

  const indexes = await api.getIndexes();
  filtering.updateIndexes(indexes);

  table.init();
  pagination.init();
  filtering.init();

  async function render(action) {
    const searchInput = document.querySelector('[data-name="search"]');
    const pageRadio = document.querySelector('[name="page"]:checked');
    const rowsSelect = document.querySelector('[data-name="rowsPerPage"]');
    const sortDateBtn = document.querySelector('[data-name="sortByDate"]');
    const sortTotalBtn = document.querySelector('[data-name="sortByTotal"]');

    const state = {
      search: searchInput?.value || '',
      page: pageRadio ? parseInt(pageRadio.value, 10) : 1,
      rowsPerPage: rowsSelect ? parseInt(rowsSelect.value, 10) : 6,
      sortField: null,
      sortOrder: 'none',
    };

    if (sortDateBtn?.dataset.value && sortDateBtn.dataset.value !== 'none') {
      state.sortField = 'date';
      state.sortOrder = sortDateBtn.dataset.value;
    } else if (sortTotalBtn?.dataset.value && sortTotalBtn.dataset.value !== 'none') {
      state.sortField = 'total';
      state.sortOrder = sortTotalBtn.dataset.value;
    }

    let query = {};
    query = pagination.applyPagination(query, state, action);
    query = filtering.applyFiltering(query, state, action);
    query = searching(query, state, action);
    query = sorting(query, state, action);

    const { total, items } = await api.getRecords(query);

    pagination.updatePagination(total, query);
    table.render(items);
  }

  window.onTableAction = (action) => {
    if (action?.type === 'sort') {
      const { field, order } = action.payload;
      const dateBtn = document.querySelector('[data-name="sortByDate"]');
      const totalBtn = document.querySelector('[data-name="sortByTotal"]');

      if (dateBtn) dateBtn.dataset.value = field === 'date' ? order : 'none';
      if (totalBtn) totalBtn.dataset.value = field === 'total' ? order : 'none';
    }
    render(action);
  };

  render();
});