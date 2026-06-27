import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        // Находим активное поле сортировки и маппим его на имя поля в API
        Object.keys(columns).forEach(col => {
            if (state.sortField === col) {
                field = sortMap[col];
                order = state.sortOrder;
            }
        });

        const sort = (field && order !== 'none') ? `${field}:${order}` : null;

        return sort ? Object.assign({}, query, { sort }) : query;
    };
}