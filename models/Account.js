import { Schema, model } from "mongoose";

const accountSchema = new Schema(
  {
    name:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    session: {
      opening: {
        type: Date,
        default:null
      },
      closing: {
        type: Date,
        default:null
      },
      change: {
        type: Number,
        default: 0,
      },
      profit: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Account", accountSchema);
