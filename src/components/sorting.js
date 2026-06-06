import { sortMap } from '../lib/sort.js'; // 🔥 sortCollection больше не нужен

export function initSorting(columns) {
    return (query, state, action) => {
        // 🔥 Определяем поле и направление сортировки (из твоей прошлой логики)
        let field = null;
        let order = 'none';
        
        // Пример: ищем активную колонку в state
        Object.keys(columns).forEach(col => {
            if (state.sortField === col) {
                field = sortMap[col]; // маппинг на имя поля в API
                order = state.sortOrder; // 'asc' или 'desc'
            }
        });
        
        // Формируем параметр sort: "date:desc" или null
        const sort = (field && order !== 'none') 
            ? `${field}:${order}` 
            : null;
            
        return sort 
            ? Object.assign({}, query, { sort }) 
            : query;
    };
}