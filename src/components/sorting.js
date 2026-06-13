import { sortMap } from '../lib/sort.js';

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        // Используем columns[col] для маппинга на имя поля в API
        Object.keys(columns).forEach(col => {
            if (state.sortField === col) {
                field = columns[col];
                order = state.sortOrder;
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