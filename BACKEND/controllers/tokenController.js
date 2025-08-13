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


// controllers/mpesaController.js

// NEW: Register C2B URLs with Safaricom
 const registerC2B = async (req, res) => {
  try {
    const token = await getAccessToken(); // already in your stkpush code

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl", // Change to live URL in production
      {
        ShortCode: process.env.MPESA_SHORTCODE, // Your till or paybill
        ResponseType: "Completed", // 'Cancelled' if you want incomplete payments sent too
        ConfirmationURL: `${process.env.BASE_URL}/api/mpesa/confirmation`, // Receives payment details
        ValidationURL: `${process.env.BASE_URL}/api/mpesa/validation` // Can accept/reject payments
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json({
      message: "C2B URLs registered successfully",
      data: response.data
    });

  } catch (error) {
    console.error("Error registering C2B URLs:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to register C2B URLs" });
  }
};

// controllers/mpesaController.js

// C2B Confirmation — payment success
 const mpesaConfirmation = (req, res) => {
  console.log("🔔 Payment Confirmation:", req.body);
  // Save transaction to DB
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
};

// C2B Validation — optional: approve/reject before confirmation
 const mpesaValidation = (req, res) => {
  console.log("🔍 Payment Validation:", req.body);
  // Accept all for now
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
};


module.exports = {
  mpesaValidation, 
  mpesaConfirmation, 
  registerC2B
}

// const createToken = async (req, res) => {
//   try {
//     const { phone, houseId, unitType } = req.body;
//     const userId = req.user._id;

//     const amount = 250;

//     const token = await getAccessToken();
//     const timestamp = moment().format("YYYYMMDDHHmmss");
//     const password = Buffer.from(
//       mpesa.shortCode + mpesa.passkey + timestamp
//     ).toString("base64");

//     const payload = {
//       BusinessShortCode: mpesa.shortCode,
//       Password: password,
//       Timestamp: timestamp,
//       TransactionType: "CustomerPayBillOnline",
//       Amount: amount,
//       PartyA: 254712345678,
//       PartyB: mpesa.shortCode,
//       PhoneNumber: 254712345678,
//       CallBackURL: mpesa.callbackUrl,
//       AccountReference: "Fixed250",
//       TransactionDesc: "Access content",
//     };

//     const response = await axios.post(
//       `${mpesa.baseUrl}/mpesa/stkpush/v1/processrequest`,
//       payload,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const checkoutRequestId = response.data.CheckoutRequestID;

//     // Save to DB
//     await Payment.create({
//       checkoutRequestId,
//       phone,
//       userId,
//       houseId,
//       unitType,
//       amount,
//     });
//     console.log("finished", response.data);

//     res.json({ message: "STK push sent", data: response.data });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Payment initiation failed" });
//   }
// };

// module.s = createToken;
