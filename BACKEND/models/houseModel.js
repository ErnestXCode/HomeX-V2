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
    thumbnails: {
      type: [String],
      required: [true, "thumbnail is required"],
    },
    pricing: {
      type: Number,
      required: [true, "pricing is required"],
      index: true,
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
    placeholderThumbnail: {
      type: String,
    },
    // type eg bedsitters
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
        // shared or private
      },
      // laundry facilities 
      
      shower: {
        type: Boolean,
        default: false,
      },
      security: {
        type: Boolean,
        default: false,
        // cctv cameras
      },
      electricity: {
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
