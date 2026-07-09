import { cloneTemplate } from '../lib/utils.js';

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  if (before) {
    [...before].reverse().forEach((templateName) => {
      root[templateName] = cloneTemplate(templateName);
      root.container.prepend(root[templateName].container);
    });
  }

  if (after) {
    after.forEach((templateName) => {
      root[templateName] = cloneTemplate(templateName);
      root.container.append(root[templateName].container);
    });
  }

  root.container.addEventListener('change', (event) => {
    onAction(event.target);
  });

  root.container.addEventListener('reset', () => {
    setTimeout(() => onAction());
  });

  root.container.addEventListener('submit', (event) => {
    event.preventDefault();
    onAction(event.submitter);
  });

  const render = (data) => {
    const rows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        const cell = row.elements[key];

        if (cell) {
          cell.textContent = item[key];
        }
      });

      return row.container;
    });

    root.elements.rows.replaceChildren(...rows);
  };

  return {
    ...root,
    render
  };
}