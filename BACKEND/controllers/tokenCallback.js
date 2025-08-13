const Payment = require("../models/payModel");
const House = require("../models/houseModel");
const User = require("../models/userModel");


const callbackController = async (req, res) => {
  console.log("callback started");

  // ⬇️ C2B sends data differently, adjust parsing
  const cb = req.body; 
  console.log(cb);

  // For C2B, Safaricom sends ResultCode only in B2C/STK — 
  // here we check TransID presence to confirm success
  const resultType = cb.TransID ? "success" : "failed";

  if (resultType === "success") {
    const phone = cb.MSISDN;
    const amount = cb.TransAmount;
    const mpesaReceipt = cb.TransID;
    const transactionId = cb.TransID; // store as our internal transactionId

    // Step 1: Find the payment record (pending)
    const payment = await Payment.findOne({
      phone,
      status: "pending",
    });

    if (!payment) {
      console.error("Payment not found in DB");
      return res.sendStatus(400);
    }

    // Step 2: Update the house availability
    const house = await House.findById(payment.houseId);
    const unit = house.units[payment.unitType];
    unit.unitsVacant -= 1;

    house.units[payment.unitType] = unit;
    await house.save();

    // Step 3: Update payment record
    payment.status = "success";
    payment.mpesaReceipt = mpesaReceipt;
    payment.transactionId = transactionId;
    await payment.save();

    // Step 4: Update user purchases
    const purchaser = await User.findById(payment.userId);
    purchaser.purchases = [...purchaser.purchases, payment.houseId];
    await purchaser.save();

    console.log("✅ Payment successful and unit updated");
    return res.sendStatus(200);
  } else {
    console.log("❌ Payment Failed");

    // Mark payment as failed if matching pending one found
    const payment = await Payment.findOne({ phone: cb.MSISDN, status: "pending" });
    if (payment) {
      payment.status = "failed";
      await payment.save();
    }

    return res.sendStatus(200);
  }
};

module.exports = callbackController;
