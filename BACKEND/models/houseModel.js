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
    },
    landLord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    numOfHouses: {
      type: Number,
      required: [true, "number of houses required"],
    },
    status: {
      type: String,
      enum: ["taken", "possibly_taken", "vacant"],
      default: "vacant",
    },
    amenities: {
      wifi: {
        type: Boolean,
        default: false,
      },
      water: {
        type: Boolean,
        default: false,
      },
      bathroom: {
        type: Boolean,
        default: false,
      },
      shower: {
        type: Boolean,
        default: false,
      },
    },
    updatedStatusAt: { type: Date },
    coords: {
      type: Object,
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;
