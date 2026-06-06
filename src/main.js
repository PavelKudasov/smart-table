import { initData } from './data.js';
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';
import { createTable } from './components/table.js';

// ... (твой код создания элементов) ...

// 🔥 Инициализация API
const api = initData(sourceData);

// 🔥 Инициализация компонентов (вернут по 2 функции)
const { applyPagination, updatePagination } = initPagination(paginationElements);
const { applyFiltering, updateIndexes: updateFilterIndexes } = initFiltering(filterElements);
const applySearching = initSearching('search');
const applySorting = initSorting(columns);

const sampleTable = createTable(tableElement);

// 🔥 Асинхронная функция инициализации
async function init() {
    const indexes = await api.getIndexes();
    
    // Заполняем select фильтра продавцами
    updateFilterIndexes(filterElements, { searchBySeller: indexes.sellers });
}

// 🔥 Асинхронный render
async function render(action) {
    let state = collectState();
    let query = {}; // 🔥 параметры для запроса, а не данные
    
    // 🔥 Применяем компоненты ДО запроса (формируем query)
    query = applyPagination(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySearching(query, state, action);
    query = applySorting(query, state, action);
    
    // 🔥 Запрашиваем данные с сервера
    const { total, items } = await api.getRecords(query);
    
    // 🔥 Обновляем интерфейс ПОСЛЕ получения данных
    updatePagination(total, query);
    sampleTable.render(items); // 🔥 передаём items, а не весь result
}

// 🔥 Запуск
init().then(() => render()).catch(err => console.error('Ошибка инициализации:', err));

// 🔥 Обработчики событий (оставляем как были, но вызываем render)
paginationElements.prev?.addEventListener('click', () => render({ type: 'prev' }));
paginationElements.next?.addEventListener('click', () => render({ type: 'next' }));
// ... остальные обработчики ...