const axios = require("axios");

const consumerKey = "Cn7uYrUrO0GwOnGseymp6R2rT5RF9vjw6jPr9Q9xggHL9h10";
const consumerSecret = "2u8Kx4nWvI8mQVbXcNGsbJISY6yAqSAqk31qQbAGJAxwR2xUDRUkUc4DQryuRYn4";
const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

axios
  .get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  .then((res) => {
    console.log("✅ Access Token:", res.data);
  })
  .catch((err) => {
    console.error("❌ Error:", err.response?.data || err.message);
  });
