import { requestHandler } from '../../studio/services/RequestHandler';

const baseURL = "https://ds-metrics-api.bever.digitaldots.ai"

export const demoDashboardService = {
    getProductInsights, getChannels, getProducts, getInsightData, getSalesData
}

function getProductInsights(startDate, endDate, productName) {
    return requestHandler.fetch(`${baseURL}/product-insights?start_date=${startDate}&end_date=${endDate}&product_name=${productName}`)
}

function getChannels() {
    return requestHandler.fetch(`${baseURL}/channels`)
}

function getProducts(product) {
    return requestHandler.fetch(`${baseURL}/products?channel=${product}`)
}

function getInsightData(startDate, endDate, productName, entity) {
    return requestHandler.fetch(`${baseURL}/entity?start_date=${startDate}&end_date=${endDate}&product_name=${productName}&entity=${entity}`)
}

function getSalesData() {
    return requestHandler.fetch(`https://sales.bever.digitaldots.ai/api/sales/dashboard`, { authType: 'NONE' })
}
