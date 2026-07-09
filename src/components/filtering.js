export function initFiltering(elements) {
  const updateIndexes = (filterElements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      filterElements[elementName].append(...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement('option');

        option.textContent = name;
        option.value = name;

        return option;
      }));
    });
  };

  const applyFiltering = (query) => {
    const filter = {};

    Object.keys(elements).forEach((key) => {
      const element = elements[key];

      if (['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
        filter[`filter[${element.name}]`] = element.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering
  };
}