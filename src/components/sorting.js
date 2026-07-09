import { sortMap } from '../lib/sort.js';

export function initSorting(columns) {
  return (query, state) => {
    const field = columns[state.sortField];
    const order = state.sortOrder;
    const sort = field && order !== 'none' ? `${sortMap[field]}:${order}` : null;

    return sort
      ? Object.assign({}, query, { sort })
      : query;
  };
}