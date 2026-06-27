import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // 🔥 Обработка дополнительных шаблонов до таблицы (header, filter)
    if (before) {
        before.reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.prepend(root[subName].container);
        });
    }

    // 🔥 Обработка дополнительных шаблонов после таблицы
    if (after) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.append(root[subName].container);
        });
    }

    // 🔥 Обработчики событий формы (если есть)
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(onAction));
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitter = e.submitter || document.activeElement;
        onAction(submitter);
    });

    // 🔥 Функция рендера строк
    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            // Заполняем ячейки данными
            Object.keys(item).forEach(key => {
                const cell = row.elements[key];
                if (cell) {
                    cell.textContent = item[key];
                }
            });
            
            return row.container;
        });
        
        // Заменяем содержимое tbody
        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}