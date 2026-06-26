const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

let sellersCache = {};
let customersCache = {};
let cachedResult = null;
let cachedQuery = null;

const mapRecords = (records) => records.map((item) => ({
  id: item.receipt_id,
  date: item.date,
  seller: sellersCache[item.seller_id] || 'Неизвестный',
  customer: customersCache[item.customer_id] || 'Неизвестный',
  total: item.total_amount,
}));

export function initData() {
  const getIndexes = async () => {
    if (!Object.keys(sellersCache).length || !Object.keys(customersCache).length) {
      const [sellersResponse, customersResponse] = await Promise.all([
        fetch(`${BASE_URL}/sellers`),
        fetch(`${BASE_URL}/customers`),
      ]);

      if (!sellersResponse.ok || !customersResponse.ok) {
        throw new Error('Failed to load indexes from server');
      }

      let sellersList = await sellersResponse.json();
      let customersList = await customersResponse.json();

      // 🔥 Защита: если сервер вернул объект, превращаем его в массив значений
      if (!Array.isArray(sellersList)) {
        sellersList = typeof sellersList === 'object' ? Object.values(sellersList) : [];
      }
      if (!Array.isArray(customersList)) {
        customersList = typeof customersList === 'object' ? Object.values(customersList) : [];
      }

      sellersCache = sellersList.reduce((acc, item) => {
        acc[item.id] = item.name || item;
        return acc;
      }, {});

      customersCache = customersList.reduce((acc, item) => {
        acc[item.id] = item.name || item;
        return acc;
      }, {});
    }

    return { sellers: sellersCache, customers: customersCache };
  };

  const getRecords = async (query = {}, forceUpdate = false) => {
    const queryString = new URLSearchParams(query).toString();

    if (cachedQuery === queryString && !forceUpdate && cachedResult) {
      return cachedResult;
    }

    const response = await fetch(`${BASE_URL}/records?${queryString}`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const serverData = await response.json();

    cachedQuery = queryString;
    cachedResult = {
      total: serverData.total,
      items: mapRecords(serverData.items),
    };

    return cachedResult;
  };

  return { getIndexes, getRecords };
}