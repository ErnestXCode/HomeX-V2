const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  checkoutRequestId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  unitType: { type: String, required: true },
  amount: { type: Number, default: 250 },
  status: { type: String, default: "pending" }, // 'pending', 'success', 'failed'
  mpesaReceipt: String,
});

module.exports = mongoose.model("Payment", paymentSchema);
