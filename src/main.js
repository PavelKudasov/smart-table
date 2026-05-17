import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение
const rowsPerPage = parseInt(state.rowsPerPage);
const page = parseInt(state.page ?? 1);

return {
  ...state,
  rowsPerPage,
  page
};

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    return {
        ...state
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование
const sampleTable = initTable({
  container: document.querySelector('#table-container'), // или ваш селектор
  rowTemplate: 'row',
  before: ['search', 'header', 'filter'], // порядок важен: поиск → сортировка → фильтр
  after: ['pagination']
});

const applySearching = initSearching('search');
const applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers
});
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal
]);
const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: [],
    after: []
}, render);

// @todo: инициализация
let result = sourceData;
result = applySearching(result, state);
result = applyFiltering(result, state, action);
result = applySorting(result, state, action);
result = applyPagination(result, state, action);
sampleTable.render(result); // или ваш метод вывода строк

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
