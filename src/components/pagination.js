export function initPagination(elements) {
    let pageCount = 1;

    // 🔥 Формируем параметры пагинации для запроса (вызывается ДО fetch)
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage || 6;
        let page = state.page || 1;
        
        // Обработка действий (из твоей прошлой работы)
        if (action?.type === 'next' && page < pageCount) page++;
        if (action?.type === 'prev' && page > 1) page--;
        if (action?.type === 'page' && action.payload) page = action.payload;
        
        return Object.assign({}, query, { limit, page });
    };

    // 🔥 Обновляем интерфейс пагинации (вызывается ПОСЛЕ fetch)
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);
        
        // Обновляем текст "Показано X из Y"
        if (elements.info) {
            const start = (page - 1) * limit + 1;
            const end = Math.min(page * limit, total);
            elements.info.textContent = `Показано ${start}–${end} из ${total}`;
        }
        
        // Активируем/деактивируем кнопки
        if (elements.prev) elements.prev.disabled = page === 1;
        if (elements.next) elements.next.disabled = page === pageCount;
        
        // 🔥 Перерисовка кнопок страниц (упрощённо)
        if (elements.pages) {
            elements.pages.innerHTML = '';
            const maxVisible = 5;
            let start = Math.max(1, page - Math.floor(maxVisible / 2));
            let end = Math.min(pageCount, start + maxVisible - 1);
            
            for (let i = start; i <= end; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.dataset.page = i;
                if (i === page) btn.classList.add('active');
                btn.addEventListener('click', () => render({ type: 'page', payload: i }));
                elements.pages.appendChild(btn);
            }
        }
    };

    return { applyPagination, updatePagination };
}