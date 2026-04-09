// netlify/functions/get-orders.js
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // 可选：加一个简单的密码验证，防止别人乱看
  const password = event.queryStringParameters?.p;
  const correctPassword = 'admin123';  // 你可以改成自己的密码
  
  if (password !== correctPassword) {
    return {
      statusCode: 401,
      body: '需要密码，请在网址后加上 ?p=你的密码'
    };
  }

  try {
    const store = getStore('orders');
    const allKeys = await store.list();
    const orders = [];
    for (const key of allKeys) {
      const data = await store.get(key);
      if (data) orders.push(JSON.parse(data));
    }
    // 按时间倒序
    orders.sort((a,b) => new Date(b.receivedAt) - new Date(a.receivedAt));
    
    // 返回 HTML 页面方便查看
    let html = `<h1>订单列表 (共${orders.length}条)</h1><ul>`;
    for (let o of orders) {
      html += `<li><strong>${o.serviceName}</strong> - ${o.userName} (${o.userPhone}) - ${o.dorm}<br>详情: ${o.detail}<br>时间: ${o.receivedAt}</li><hr>`;
    }
    html += `</ul>`;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `错误: ${err.message}`
    };
  }
};