export function initFiltering(elements) {
    const updateIndexes = (filterElements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const element = filterElements[elementName];

            if (!element) {
                return;
            }

            const options = Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement('option');

                option.textContent = name;
                option.value = name;

                return option;
            });

            element.append(...options);
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action?.name === 'clear') {
            const fieldName = action.dataset.field;

            Object.values(elements).forEach((element) => {
                if (element?.name === fieldName) {
                    element.value = '';
                }
            });
        }

        const filter = {};

        Object.keys(elements).forEach((key) => {
            const element = elements[key];

            if (
                element &&
                ['INPUT', 'SELECT'].includes(element.tagName) &&
                element.value
            ) {
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