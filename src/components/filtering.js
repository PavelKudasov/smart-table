export function initFiltering(elements) {
    // 🔥 Заполнение select опциями (вызывается после getIndexes)
    const updateIndexes = (filterElements, indexes) => {
        Object.keys(indexes).forEach(key => {
            const select = filterElements[key];
            if (select && select.tagName === 'SELECT') {
                // Сохраняем текущее значение
                const current = select.value;
                // Очищаем и заполняем заново
                select.innerHTML = '<option value="">Все</option>';
                Object.values(indexes[key]).forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                });
                // Восстанавливаем значение
                if (current) select.value = current;
            }
        });
    };

    // 🔥 Формирование параметров фильтра для запроса
    const applyFiltering = (query, state, action) => {
        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && el.value && ['INPUT', 'SELECT'].includes(el.tagName)) {
                // Формируем вложенный параметр: filter[seller]=Иван
                filter[`filter[${el.name}]`] = el.value;
            }
        });
        
        return Object.keys(filter).length 
            ? Object.assign({}, query, filter) 
            : query;
    };

    return { updateIndexes, applyFiltering };
}