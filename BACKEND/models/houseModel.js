const mongoose = require("mongoose");

const houseSchema = mongoose.Schema(
  {
    area: {
      type: String,
      required: [true, "area is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    pricing: {
      type: String,
      required: [true, "pricing is required"],
    },
    landMarks: {
      type: String,
      required: [true, "landMarks is required"],
    },
    landLord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;
