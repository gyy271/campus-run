const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const order = JSON.parse(event.body);
    order.receivedAt = new Date().toISOString();
    const store = getStore('orders');
    const key = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    await store.set(key, JSON.stringify(order));
    return { statusCode: 200, body: JSON.stringify({ status: 'ok', key }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: '保存失败' }) };
  }
};