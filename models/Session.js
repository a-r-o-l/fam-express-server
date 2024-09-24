import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    opening: {
      type: Date,
      default: null,
    },
    closing: {
      type: Date,
      default: null,
    },
    change: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: null,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("Session", sessionSchema);
