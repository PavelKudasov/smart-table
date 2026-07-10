import { initData } from './data.js';
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';
import { initTable } from './components/table.js';
import { processFormData } from './lib/utils.js';

const app = document.getElementById('app');
const api = initData();

const tableSettings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
};

const sampleTable = initTable(tableSettings, render);

app.append(sampleTable.container);

const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements
);

const { applyFiltering, updateIndexes } = initFiltering(
    sampleTable.filter.elements
);

const applySearching = initSearching('search');

const applySorting = initSorting(
    sampleTable.header.elements
);

function collectState() {
    const state = processFormData(
        new FormData(sampleTable.container)
    );

    const rowsPerPage = parseInt(state.rowsPerPage, 10);
    const page = parseInt(state.page ?? 1, 10);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

function showLoadingError() {
    sampleTable.render([]);

    updatePagination(0, {
        page: 1,
        limit: 10
    });

    let errorElement = app.querySelector('.loading-error');

    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'loading-error';
        app.append(errorElement);
    }

    errorElement.textContent =
        'Не удалось получить данные с учебного сервера. Попробуйте обновить страницу позже.';
}

function clearLoadingError() {
    const errorElement = app.querySelector('.loading-error');

    if (errorElement) {
        errorElement.remove();
    }
}

async function render(action) {
    try {
        const state = collectState();
        let query = {};

        query = applySearching(query, state, action);
        query = applyFiltering(query, state, action);
        query = applySorting(query, state, action);
        query = applyPagination(query, state, action);

        const { total, items } = await api.getRecords(query);

        clearLoadingError();
        updatePagination(total, query);
        sampleTable.render(items);
    } catch (error) {
        showLoadingError();
    }
}

async function init() {
    try {
        const indexes = await api.getIndexes();

        updateIndexes(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers
        });

        await render();
    } catch (error) {
        showLoadingError();
    }
}

init();