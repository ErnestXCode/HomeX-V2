const Payment = require("../models/payModel");

// ⬇️ No axios/mpesa token needed for manual C2B trigger
// const axios = require("axios"); // removed
// const mpesa = require("../config/mpesaConfig"); // removed
// const moment = require("moment"); // removed

const initiateC2B = async (req, res) => {
  try {
    const { phone, houseId, unitType } = req.body;
    const userId = req.user._id;
    const amount = 250;

    // 1️⃣ Create pending payment record
    const payment = await Payment.create({
      phone,
      userId,
      houseId,
      unitType,
      amount,
      status: "pending",
    });

    // 2️⃣ Return till + reference for frontend to dial
    res.json({
      success: true,
      message: "Proceed to M-PESA payment",
      paymentId: payment._id,
      tillNumber: "6962484", // Your C2B till
      reference: `HOUSE-${houseId}`, // Matches C2B AccountReference
      amount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};

module.exports = initiateC2B;
