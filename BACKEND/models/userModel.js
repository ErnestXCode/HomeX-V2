const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ROLES_LIST = require("../config/roles_list");

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
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    roles: {
      tenant: {
        type: Number,
        default: ROLES_LIST.tenant,
      },
      landlord: Number,
      admin: Number,
    },
    refreshToken: [String], 
    shortLists: {
      type: [mongoose.Schema.Types.ObjectId], 
      ref: 'House'
    }
   
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);

module.exports = User;
