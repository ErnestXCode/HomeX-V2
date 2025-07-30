const Payment = require("../models/payModel");
const House = require("../models/houseModel");
const User = require("../models/userModel");

const callbackController = async (req, res) => {
    console.log('callback started')
  const cb = req.body.Body.stkCallback;

  if (cb.ResultCode === 0) {
    const items = cb.CallbackMetadata.Item;
    const phone = items.find((i) => i.Name === "PhoneNumber")?.Value;
    const amount = items.find((i) => i.Name === "Amount")?.Value;
    const mpesaReceipt = items.find(
      (i) => i.Name === "MpesaReceiptNumber"
    )?.Value;
    const checkoutRequestId = cb.CheckoutRequestID;

    // Step 1: Find the payment record
    const payment = await Payment.findOne({ checkoutRequestId });

    if (!payment) {
      console.error("Payment not found in DB");
      return res.sendStatus(400);
    }

    // Step 2: Update the house
    const house = await House.findById(payment.houseId);
    const unit = house.units[payment.unitType];
    unit.unitsVacant -= 1;

    house.units[payment.unitType] = unit;
    const housePaid = await house.save();
    console.log(housePaid)

    // Step 3: Update the payment status
    payment.status = "success";
    payment.mpesaReceipt = mpesaReceipt;
    const housePay = await payment.save();

    const purchaser = await User.findById(payment.userId)
    purchaser.purchases = [...purchaser.purchases, payment.houseId]
    const userPay = await purchaser.save()

    console.log(housePay, userPay)


    console.log("✅ Payment successful and unit updated");
    return res.sendStatus(200);
  } else {
    console.log("❌ Payment Failed:", cb.ResultDesc);

    // Optionally: update payment status to failed
    const checkoutRequestId = cb.CheckoutRequestID;
    await Payment.findOneAndUpdate({ checkoutRequestId }, { status: "failed" });

    return res.sendStatus(200);
  }
};

module.exports = callbackController;
