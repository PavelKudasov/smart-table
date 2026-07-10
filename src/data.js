const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

const REQUEST_ATTEMPTS = 3;
const RETRY_DELAY = 1500;

const wait = (delay) => new Promise((resolve) => {
    setTimeout(resolve, delay);
});

const requestJson = async (url) => {
    let lastError;

    for (let attempt = 1; attempt <= REQUEST_ATTEMPTS; attempt += 1) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            lastError = error;

            if (attempt < REQUEST_ATTEMPTS) {
                await wait(RETRY_DELAY);
            }
        }
    }

    throw lastError;
};

export function initData() {
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    const mapRecords = (records) => records.map((item) => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                requestJson(`${BASE_URL}/sellers`),
                requestJson(`${BASE_URL}/customers`)
            ]);
        }

        return {
            sellers,
            customers
        };
    };

    const getRecords = async (query, isUpdated = false) => {
        const searchParams = new URLSearchParams(query);
        const nextQuery = searchParams.toString();

        if (
            lastQuery === nextQuery &&
            lastResult &&
            !isUpdated
        ) {
            return lastResult;
        }

        const records = await requestJson(
            `${BASE_URL}/records?${nextQuery}`
        );

        lastQuery = nextQuery;

        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}