require("dotenv").config();

const isProduction = process.env.MPESA_ENV === "production";

module.exports = {
  baseUrl: isProduction
    ? process.env.MPESA_PROD_URL
    : process.env.MPESA_SANDBOX_URL,

  consumerKey: isProduction
    ? process.env.MPESA_PROD_CONSUMER_KEY
    : process.env.MPESA_SANDBOX_CONSUMER_KEY,

  consumerSecret: isProduction
    ? process.env.MPESA_PROD_CONSUMER_SECRET
    : process.env.MPESA_SANDBOX_CONSUMER_SECRET,

  shortCode: process.env.SHORTCODE,
  passkey: process.env.PASSKEY,
  callbackUrl: process.env.CALLBACK_URL,
};
