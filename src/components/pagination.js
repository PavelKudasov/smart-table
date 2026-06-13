export function initPagination(elements) {
    // Формируем параметры пагинации для запроса
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage || 6;
        let page = state.page || 1;

        if (action?.type === 'page' && action.payload) {
            page = action.payload;
        }

        return Object.assign({}, query, { limit, page });
    };

    return { applyPagination };
}