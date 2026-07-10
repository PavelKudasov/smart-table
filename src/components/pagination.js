import { getPages } from '../lib/utils.js';

export function initPagination(elements) {
    let pageCount = 1;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage || 10;
        let page = state.page || 1;

        if (action) {
            if (action.name === 'first') {
                page = 1;
            }

            if (action.name === 'prev') {
                page = Math.max(1, page - 1);
            }

            if (action.name === 'next') {
                page = Math.min(pageCount, page + 1);
            }

            if (action.name === 'last') {
                page = pageCount;
            }

            if (
                [
                    'search',
                    'date',
                    'customer',
                    'seller',
                    'totalFrom',
                    'totalTo',
                    'rowsPerPage',
                    'clear',
                    'sort',
                    'reset'
                ].includes(action.name)
            ) {
                page = 1;
            }
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit) || 1;

        const fromRow = total === 0
            ? 0
            : (page - 1) * limit + 1;

        const toRow = Math.min(page * limit, total);

        elements.fromRow.textContent = fromRow;
        elements.toRow.textContent = toRow;
        elements.totalRows.textContent = total;

        elements.firstPage.disabled = page <= 1;
        elements.previousPage.disabled = page <= 1;
        elements.nextPage.disabled = page >= pageCount;
        elements.lastPage.disabled = page >= pageCount;

        const pages = getPages(page, pageCount, 5);

        const pageElements = pages.map((pageNumber) => {
            const label = document.createElement('label');
            label.className = 'pagination-button';
            label.setAttribute(
                'aria-label',
                `Goto page ${pageNumber}`
            );

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'page';
            input.value = pageNumber;
            input.checked = pageNumber === page;

            const text = document.createElement('span');
            text.textContent = pageNumber;

            label.append(input, text);

            return label;
        });

        elements.pages.replaceChildren(...pageElements);
    };

    return {
        applyPagination,
        updatePagination
    };
}