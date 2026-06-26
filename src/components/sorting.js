import { sortMap } from '../lib/sort.js';

export function initSorting() {
  return (query, state) => {
    let sortField = null;
    let sortOrder = 'none';

    if (state.sortField && sortMap[state.sortField]) {
      sortField = sortMap[state.sortField];
      sortOrder = state.sortOrder || 'asc';
    }

    const sortParam = sortField && sortOrder !== 'none' ? `${sortField}:${sortOrder}` : null;
    return sortParam ? { ...query, sort: sortParam } : query;
  };
}