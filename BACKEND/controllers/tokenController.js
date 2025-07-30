const axios = require("axios");
const Payment = require("../models/payModel");
const moment = require("moment");
const User = require("../models/userModel");
const mpesa = require('../config/mpesaConfig')

async function getAccessToken() {
  const auth = Buffer.from(
    `${mpesa.consumerKey}:${mpesa.consumerSecret}`
  ).toString("base64");
  const { data } = await axios.get(
    `${mpesa.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  return data.access_token;
}

const createToken = async (req, res) => {
  try {
    const { phone, houseId, unitType } = req.body;
    const userId = req.user._id;

    const amount = 250;

    const token = await getAccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      mpesa.shortCode + mpesa.passkey + timestamp
    ).toString("base64");

    const payload = {
      BusinessShortCode: mpesa.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: 254712345678,
      PartyB: mpesa.shortCode,
      PhoneNumber: 254712345678,
      CallBackURL: mpesa.callbackUrl,
      AccountReference: "Fixed250",
      TransactionDesc: "Access content",
    };

    const response = await axios.post(
      `${mpesa.baseUrl}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const checkoutRequestId = response.data.CheckoutRequestID;

    // Save to DB
    await Payment.create({
      checkoutRequestId,
      phone,
      userId,
      houseId,
      unitType,
      amount,
    });
    console.log("finished", response.data);

    res.json({ message: "STK push sent", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};

module.exports = createToken;
