export function initPagination(elements) {
    let pageCount;

    const applyPagination = (query, state, action) => {
        // 🔥 Добавляем дефолтные значения, чтобы не было undefined
        const limit = state.rowsPerPage || 6;
        let page = state.page || 1;

        if (action?.type === 'next' && page < pageCount) page++;
        if (action?.type === 'prev' && page > 1) page--;
        if (action?.type === 'page' && action.payload) page = action.payload;

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        if (elements.fromRow) elements.fromRow.textContent = (page - 1) * limit + 1;
        if (elements.toRow) elements.toRow.textContent = Math.min(page * limit, total);
        if (elements.totalRows) elements.totalRows.textContent = total;

        if (elements.prev) elements.prev.disabled = page === 1;
        if (elements.next) elements.next.disabled = page === pageCount;

        if (elements.pages) {
            elements.pages.innerHTML = '';
            const maxVisible = 5;
            let start = Math.max(1, page - Math.floor(maxVisible / 2));
            let end = Math.min(pageCount, start + maxVisible - 1);
            
            for (let i = start; i <= end; i++) {
                const label = document.createElement('label');
                label.className = 'pagination-button';
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'page';
                input.value = i;
                if (i === page) input.checked = true;
                const span = document.createElement('span');
                span.textContent = i;
                label.appendChild(input);
                label.appendChild(span);
                label.addEventListener('click', () => {
                    if (typeof render === 'function') {
                        render({ type: 'page', payload: i });
                    }
                });
                elements.pages.appendChild(label);
            }
        }
    };

    return {
        applyPagination,
        updatePagination
    };
}