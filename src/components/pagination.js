export function initPagination() {
  let paginationElements = {};
  let totalPages = 1;

  return {
    init() {
      paginationElements = {
        prev: document.querySelector('[data-name="previousPage"]'),
        next: document.querySelector('[data-name="nextPage"]'),
        pagesContainer: document.querySelector('[data-name="pages"]'),
        fromRow: document.querySelector('[data-name="fromRow"]'),
        toRow: document.querySelector('[data-name="toRow"]'),
        totalRows: document.querySelector('[data-name="totalRows"]'),
        rowsPerPage: document.querySelector('[data-name="rowsPerPage"]'),
      };

      if (paginationElements.rowsPerPage) {
        paginationElements.rowsPerPage.addEventListener('change', () => {
          window.onTableAction({ type: 'changeLimit' });
        });
      }
    },

    applyPagination(query, state, action) {
      const limit = state.rowsPerPage || 6;
      let page = state.page || 1;

      if (action?.type === 'nextPage' && page < totalPages) {
        page += 1;
      } else if (action?.type === 'prevPage' && page > 1) {
        page -= 1;
      } else if (action?.type === 'gotoPage' && action.payload) {
        page = action.payload;
      } else if (action?.type === 'changeLimit') {
        page = 1;
      }

      return { ...query, limit, page };
    },

    updatePagination(total, query) {
      const { page, limit } = query;
      totalPages = Math.ceil(total / limit);

      if (paginationElements.fromRow) {
        paginationElements.fromRow.textContent = (page - 1) * limit + 1;
      }
      if (paginationElements.toRow) {
        paginationElements.toRow.textContent = Math.min(page * limit, total);
      }
      if (paginationElements.totalRows) {
        paginationElements.totalRows.textContent = total;
      }
      if (paginationElements.prev) {
        paginationElements.prev.disabled = page === 1;
      }
      if (paginationElements.next) {
        paginationElements.next.disabled = page === totalPages;
      }

      if (paginationElements.pagesContainer) {
        paginationElements.pagesContainer.innerHTML = '';
        const visibleButtons = 5;
        let startPage = Math.max(1, page - Math.floor(visibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + visibleButtons - 1);

        if (endPage - startPage + 1 < visibleButtons) {
          startPage = Math.max(1, endPage - visibleButtons + 1);
        }

        for (let currentPage = startPage; currentPage <= endPage; currentPage += 1) {
          const label = document.createElement('label');
          label.className = 'pagination-button';
          label.setAttribute('aria-label', `Goto page ${currentPage}`);

          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'page';
          input.value = currentPage;
          if (currentPage === page) {
            input.checked = true;
          }

          const span = document.createElement('span');
          span.textContent = currentPage;

          label.appendChild(input);
          label.appendChild(span);
          label.addEventListener('click', () => {
            window.onTableAction({ type: 'gotoPage', payload: currentPage });
          });

          paginationElements.pagesContainer.appendChild(label);
        }
      }
    },
  };
}