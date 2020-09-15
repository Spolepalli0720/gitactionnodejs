const axios = require('axios').default;

const baseUrl = 'https://demo.digitaldots.io/api';

export default {
  getOrderSummary,
  getOrderData,
  getOrderDetails,
  confirmOrder,
  rejectOrder
}

function getOrderSummary() {
  return axios.get(`${baseUrl}/odoo/purchaseorderSummary`);
}

function getOrderData() {
  return axios.get(`${baseUrl}/odoo/purchaseorders`)
}

function getOrderDetails(orderId) {
  return axios.get(`${baseUrl}/odoo/purchaseorders/${orderId}`);
}

function confirmOrder(orderId) {
  return axios.post(`${baseUrl}/stock/confirmOrder`, {
    orderId,
    userId: 2
  });
}

function rejectOrder(orderId) {
  return axios.post(`${baseUrl}/stock/cancelOrder`, {
    orderId,
    userId: 2
  });
}