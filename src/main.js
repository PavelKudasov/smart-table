
import { initData } from './data.js';
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';
import { initTable } from './components/table.js';
import { cloneTemplate } from './lib/utils.js';

// Собираем состояние из DOM-элементов формы
function collectState() {
  const form = document.forms.table;
  if (!form) return {};

  const state = {};

  // Поиск
  const searchInput = form.closest('.container')?.querySelector('[data-name="search"]');
  if (searchInput) state.search = searchInput.value;

  // Фильтры
  const dateInput = form.querySelector('[data-name="searchByDate"]');
  if (dateInput) state.date = dateInput.value;

  const customerInput = form.querySelector('[data-name="searchByCustomer"]');
  if (customerInput) state.customer = customerInput.value;

  const sellerSelect = form.querySelector('[data-name="searchBySeller"]');
  if (sellerSelect) state.seller = sellerSelect.value;

  const totalFrom = form.querySelector('[data-name="totalFrom"]');
  const totalTo = form.querySelector('[data-name="totalTo"]');
  if (totalFrom && totalFrom.value) state.totalFrom = totalFrom.value;
  if (totalTo && totalTo.value) state.totalTo = totalTo.value;

  // Пагинация
  const rowsPerPage = form.closest('.container')?.querySelector('[data-name="rowsPerPage"]');
  if (rowsPerPage) state.rowsPerPage = parseInt(rowsPerPage.value, 10);

  const activePage = form.closest('.container')?.querySelector('[name="page"]:checked');
  if (activePage) state.page = parseInt(activePage.value, 10);

  // Сортировка
  const sortByDate = form.querySelector('[data-name="sortByDate"]');
  if (sortByDate) {
    state.sortField = 'date';
    state.sortOrder = sortByDate.dataset.value || 'none';
  }

  const sortByTotal = form.querySelector('[data-name="sortByTotal"]');
  if (sortByTotal && state.sortOrder === 'none') {
    state.sortField = 'total';
    state.sortOrder = sortByTotal.dataset.value || 'none';
  }

  return state;
}

// Обработчик действий пользователя
function onAction(submitter) {
  if (!submitter) {
    render();
    return;
  }

  const name = submitter.getAttribute('data-name');
  const field = submitter.dataset.field;

  // Пагинация
  if (name === 'firstPage') return render({ type: 'page', payload: 1 });
  if (name === 'previousPage') return render({ type: 'prev' });
  if (name === 'nextPage') return render({ type: 'next' });
  if (name === 'lastPage') {
    const totalPages = lastPageCount;
    return render({ type: 'page', payload: totalPages });
  }
  if (submitter.name === 'page') return render({ type: 'page', payload: parseInt(submitter.value, 10) });

  // Сортировка
  if (name === 'sortByDate' || name === 'sortByTotal') {
    const current = submitter.dataset.value || 'none';
    const next = current === 'none' ? 'up' : current === 'up' ? 'down' : 'none';
    submitter.dataset.value = next;
    // Сбрасываем другую сортировку
    const other = name === 'sortByDate' ? 'sortByTotal' : 'sortByDate';
    const otherBtn = document.querySelector(`[data-name="${other}"]`);
    if (otherBtn) otherBtn.dataset.value = 'none';
    return render();
  }

  // Очистка фильтра
  if (name === 'clear' && field) {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) input.value = '';
    return render();
  }

  // Сброс всех фильтров
  if (name === 'reset') {
    const form = document.forms.table;
    if (form) form.reset();
    document.querySelectorAll('[data-name^="sortBy"]').forEach(btn => btn.dataset.value = 'none');
    return render();
  }

  // Rows per page
  if (name === 'rowsPerPage') {
    return render();
  }

  render();
}

let lastPageCount = 1;

async function bootstrap() {
  const app = document.getElementById('app');
  const api = initData(null);
  const columns = { date: 'date', seller: 'seller', customer: 'customer', total: 'total' };

  // Создаём внешние элементы: search и pagination
  const searchTpl = cloneTemplate('search');
  const paginationTpl = cloneTemplate('pagination');

  // Вставляем search до таблицы, pagination — после
  app.appendChild(searchTpl.container);

  // Создаём таблицу с header и filter внутри
  const tableSettings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter'],
    after: []
  };

  const sampleTable = initTable(tableSettings, onAction);
  app.appendChild(sampleTable.container);
  app.appendChild(paginationTpl.container);

  // Собираем элементы для пагинации и фильтров
  const paginationElements = {
    prev: paginationTpl.elements.previousPage,
    next: paginationTpl.elements.nextPage,
    pages: paginationTpl.elements.pages,
    rowsPerPage: paginationTpl.elements.rowsPerPage,
    fromRow: paginationTpl.elements.fromRow,
    toRow: paginationTpl.elements.toRow,
    totalRows: paginationTpl.elements.totalRows,
  };

  const filterElements = {
    searchBySeller: sampleTable.filter?.elements?.searchBySeller,
    searchByCustomer: sampleTable.filter?.elements?.searchByCustomer,
    searchByDate: sampleTable.filter?.elements?.searchByDate,
  };

  const { applyPagination, updatePagination } = initPagination(paginationElements);
  const { applyFiltering, updateIndexes: updateFilterIndexes } = initFiltering(filterElements);
  const applySearching = initSearching('search');
  const applySorting = initSorting(columns);

  // Загружаем индексы
  const indexes = await api.getIndexes();
  updateFilterIndexes(filterElements, { searchBySeller: indexes.sellers });

  // Обновление UI пагинации
  function updatePaginationUI(total, query) {
    const { page = 1, limit = 10 } = query;
    lastPageCount = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    if (paginationElements.fromRow) paginationElements.fromRow.textContent = start;
    if (paginationElements.toRow) paginationElements.toRow.textContent = end;
    if (paginationElements.totalRows) paginationElements.totalRows.textContent = total;

    if (paginationElements.prev) paginationElements.prev.disabled = page === 1;
    if (paginationElements.next) paginationElements.next.disabled = page === lastPageCount;

    // Перерисовка кнопок страниц
    if (paginationElements.pages) {
      paginationElements.pages.innerHTML = '';
      const maxVisible = 5;
      let pStart = Math.max(1, page - Math.floor(maxVisible / 2));
      let pEnd = Math.min(lastPageCount, pStart + maxVisible - 1);
      if (pEnd - pStart + 1 < maxVisible) pStart = Math.max(1, pEnd - maxVisible + 1);

      for (let i = pStart; i <= pEnd; i++) {
        const label = document.createElement('label');
        label.className = 'pagination-button';
        label.setAttribute('aria-label', `Goto page ${i}`);

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'page';
        input.value = i;
        if (i === page) input.checked = true;

        const span = document.createElement('span');
        span.textContent = i;

        label.appendChild(input);
        label.appendChild(span);
        paginationElements.pages.appendChild(label);
      }
    }
  }

  async function render(action) {
    let state = collectState();
    let query = {};

    query = applyPagination(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySearching(query, state, action);
    query = applySorting(query, state, action);

    const { total, items } = await api.getRecords(query);

    updatePaginationUI(total, query);
    sampleTable.render(items);
  }

  render();
}

bootstrap().catch(err => console.error('Ошибка инициализации:', err));
