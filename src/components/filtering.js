export function initFiltering() {
  let filterElements = {};

  return {
    init() {
      filterElements = {
        seller: document.querySelector('[data-name="searchBySeller"]'),
        customer: document.querySelector('[data-name="searchByCustomer"]'),
        date: document.querySelector('[data-name="searchByDate"]'),
        totalFrom: document.querySelector('[data-name="totalFrom"]'),
        totalTo: document.querySelector('[data-name="totalTo"]'),
      };
    },

    updateIndexes(indexes) {
      if (filterElements.seller && indexes?.sellers) {
        filterElements.seller.innerHTML = '<option value="">Все</option>';
        for (const sellerName of Object.values(indexes.sellers)) {
          const option = document.createElement('option');
          option.value = sellerName;
          option.textContent = sellerName;
          filterElements.seller.appendChild(option);
        }
      }
    },

    applyFiltering(query, state) {
      const filterParams = {};
      if (filterElements.seller?.value) filterParams['filter[seller]'] = filterElements.seller.value;
      if (filterElements.customer?.value) filterParams['filter[customer]'] = filterElements.customer.value;
      if (filterElements.date?.value) filterParams['filter[date]'] = filterElements.date.value;
      if (filterElements.totalFrom?.value) filterParams['filter[total_from]'] = filterElements.totalFrom.value;
      if (filterElements.totalTo?.value) filterParams['filter[total_to]'] = filterElements.totalTo.value;

      return Object.keys(filterParams).length ? { ...query, ...filterParams } : query;
    },
  };
}