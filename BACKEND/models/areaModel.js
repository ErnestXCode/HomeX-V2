const mongoose = require("mongoose");

const areaSchema = mongoose.Schema({
  area: {
    type: String,
    required: [true, "area is required"],
    unique: true,
  },
});

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;
