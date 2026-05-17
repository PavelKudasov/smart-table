import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
<<<<<<< HEAD
      before.reverse().forEach(subName => {
  root[subName] = cloneTemplate(subName);
  root.container.prepend(root[subName].container);
});

after.forEach(subName => {
  root[subName] = cloneTemplate(subName);
  root.container.append(root[subName].container);
});
    // @todo: #1.3 —  обработать события и вызвать onAction()

    root.container.addEventListener('change', () => onAction());
root.container.addEventListener('reset', () => setTimeout(onAction));
root.container.addEventListener('submit', (e) => {
  e.preventDefault();
  onAction(e.submitter);
});
=======

    // @todo: #1.3 —  обработать события и вызвать onAction()

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = [];
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
>>>>>>> 44965a67d9b0021247ad4610fd6070d7de6825de
}