import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
<<<<<<< HEAD
            if (action && action.dataset.field) {
  action.dataset.value = sortMap[action.dataset.value];
  field = action.dataset.field;
  order = action.dataset.value;
}
            // @todo: #3.2 — сбросить сортировки остальных колонок
        } else {
            columns.forEach(column => {
  if (column.dataset.field !== action?.dataset.field) {
    column.dataset.value = 'none';
  }
});
            // @todo: #3.3 — получить выбранный режим сортировки
        }
        columns.forEach(column => {
  if (column.dataset.value !== 'none') {
    field = column.dataset.field;
    order = column.dataset.value;
  }
});
if (field && order !== 'none') {
  return [...data].sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}
return data;
=======

            // @todo: #3.2 — сбросить сортировки остальных колонок
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
        }

>>>>>>> 44965a67d9b0021247ad4610fd6070d7de6825de
        return sortCollection(data, field, order);
    }
}