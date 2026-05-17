import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
<<<<<<< HEAD
Object.keys(indexes).forEach((elementName) => {
  elements[elementName].append(
    ...Object.values(indexes[elementName]).map(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      return option;
    })
  );
});
const compare = createComparison(defaultRules);
=======

>>>>>>> 44965a67d9b0021247ad4610fd6070d7de6825de
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
<<<<<<< HEAD
        if (action && action.name === 'clear') {
  const input = action.parentElement.querySelector('input');
  if (input) {
    input.value = '';
    state[action.dataset.field] = '';
  }
}
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data;
        return data.filter(row => compare(row, state));
=======

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data;
>>>>>>> 44965a67d9b0021247ad4610fd6070d7de6825de
    }
}