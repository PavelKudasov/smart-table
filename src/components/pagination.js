export function initPagination(elements) {
  let pageCount = 1;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage || 10;
    let page = state.page || 1;

    if (action?.type === 'next' && page < pageCount) {
      page += 1;
    }

    if (action?.type === 'prev' && page > 1) {
      page -= 1;
    }

    if (action?.type === 'page' && action.payload) {
      page = action.payload;
    }

    return Object.assign({}, query, {
      limit,
      page
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit) || 1;

    const fromRow = total === 0 ? 0 : (page - 1) * limit + 1;
    const toRow = Math.min(page * limit, total);

    elements.fromRow.textContent = fromRow;
    elements.toRow.textContent = toRow;
    elements.totalRows.textContent = total;

    elements.first.disabled = page === 1;
    elements.prev.disabled = page === 1;
    elements.next.disabled = page === pageCount;
    elements.last.disabled = page === pageCount;

    elements.pages.innerHTML = '';

    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
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
      elements.pages.appendChild(label);
    }
  };

  return {
    applyPagination,
    updatePagination
  };
}