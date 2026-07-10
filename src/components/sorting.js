import { sortMap } from '../lib/sort.js';

export function initSorting(columns) {
    const sortButtons = Object.values(columns).filter(
        (element) => element?.name === 'sort'
    );

    return (query, state, action) => {
        if (action?.name === 'sort') {
            sortButtons.forEach((button) => {
                if (button === action) {
                    const currentOrder =
                        button.dataset.value || 'none';

                    button.dataset.value =
                        sortMap[currentOrder];
                } else {
                    button.dataset.value = 'none';
                }
            });
        }

        if (action?.name === 'reset') {
            sortButtons.forEach((button) => {
                button.dataset.value = 'none';
            });
        }

        const activeButton = sortButtons.find(
            (button) => button.dataset.value !== 'none'
        );

        const field = activeButton?.dataset.field;
        const order = activeButton?.dataset.value || 'none';

        const sort = field && order !== 'none'
            ? `${field}:${order}`
            : null;

        return sort
            ? Object.assign({}, query, { sort })
            : query;
    };
}