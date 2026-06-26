export function initTable() {
  let rowsContainer = null;
  let rowTemplate = null;

  return {
    init() {
      const tableTemplate = document.querySelector('#table');
      rowTemplate = document.querySelector('#row');

      if (!tableTemplate || !rowTemplate) {
        console.error('❌ Ошибка: в index.html не найдены шаблоны #table или #row');
        return;
      }

      // Безопасное клонирование нативным методом
      const tableNode = tableTemplate.content.cloneNode(true);
      rowsContainer = tableNode.querySelector('[data-name="rows"]');

      const app = document.getElementById('app');
      if (app) app.appendChild(tableNode);
    },

    render(data) {
      if (!Array.isArray(data) || !rowsContainer || !rowTemplate) return;

      rowsContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();

      for (const item of data) {
        const rowNode = rowTemplate.content.cloneNode(true);
        const rowElement = rowNode.querySelector('[data-name="container"]') || rowNode.firstElementChild;

        for (const [key, value] of Object.entries(item)) {
          const cell = rowElement.querySelector(`[data-name="${key}"]`);
          if (cell) cell.textContent = value ?? '';
        }
        fragment.appendChild(rowElement);
      }

      rowsContainer.appendChild(fragment);
    }
  };
}