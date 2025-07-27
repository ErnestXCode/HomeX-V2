const axios = require('axios');
const base64 = require('base-64');

const generateTimestamp = () => {
  const now = new Date();
  return now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
};

const getAccessToken = async () => {
  const auth = base64.encode(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`);
  const { data } = await axios.get(
    `${process.env.STK_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return data.access_token;
};

module.exports = { generateTimestamp, getAccessToken };
