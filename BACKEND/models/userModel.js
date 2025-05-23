const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "phoneNumber is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    roles: {
      tenant: {
        type: Number,
        default: 2001,
      },
      landlord: Number,
      admin: Number,
    },
    refreshToken: String
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
