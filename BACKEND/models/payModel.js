const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // ⬇️ STK Push-specific ID removed, replaced with generic transactionId
  transactionId: { type: String, unique: true }, // Safaricom sends this in C2B callback (MpesaReceiptNumber can also serve)
  
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
