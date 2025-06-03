const mongoose = require("mongoose");

const houseSchema = mongoose.Schema(
  {
    area: {
      type: String,
      required: [true, "area is required"],
      index: true,
    },
    images: {
      type: [String],
      required: [true, "image is required"],
    },
    pricing: {
      type: Number,
      required: [true, "pricing is required"],
      index: true,
    },
    landMarks: {
      type: String,
      required: [true, "landMarks is required"],
    },
    landLord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["taken", "possibly_taken", "vacant"],
      default: "vacant",
    },
    coords: {
      type: Object
    }
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;
