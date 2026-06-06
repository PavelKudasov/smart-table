// 🔥 Удаляем импорт compare.js — он больше не нужен!

export function initSearching(searchField) {
    return (query, state, action) => {
        // Если поле поиска не пустое — добавляем параметр search
        return state[searchField] 
            ? Object.assign({}, query, { search: state[searchField] })
            : query;
    };
}