const axios = require("axios");
const Payment = require("../models/payModel");
const moment = require("moment");
const User = require("../models/userModel");

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");
  const { data } = await axios.get(
    `${process.env.STK_URL}/oauth/v1/generate?grant_type=client_credentials`,
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
      process.env.SHORTCODE + process.env.PASSKEY + timestamp
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: 254712345678,
      PartyB: process.env.SHORTCODE,
      PhoneNumber: 254712345678,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "Fixed250",
      TransactionDesc: "Access content",
    };

    const response = await axios.post(
      `${process.env.STK_URL}/mpesa/stkpush/v1/processrequest`,
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
