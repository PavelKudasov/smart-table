const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

// Переменные для кеширования
let sellers = {};
let customers = {};
let lastResult = null;
let lastQuery = null;

// Функция для преобразования данных сервера в формат таблицы
const mapRecords = (data) => data.map(item => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount
}));

export function initData(sourceData) {
    // sourceData больше не используется — все данные с сервера
    
    const getIndexes = async () => {
        if (!Object.keys(sellers).length || !Object.keys(customers).length) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }
        return { sellers, customers };
    };

    const getRecords = async (query = {}, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();
        
        // Кеш: если запрос не изменился — возвращаем сохранённый результат
        if (lastQuery === nextQuery && !isUpdated && lastResult) {
            return lastResult;
        }
        
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const records = await response.json();
        
        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };
        
        return lastResult;
    };

    return { getIndexes, getRecords };
}