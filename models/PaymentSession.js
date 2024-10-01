import { Schema, model } from "mongoose";

const paymentSessionSchema = new Schema(
  {
    date: {
      type: String,
    },
    transfer: {
      type: Number,
      default: 0,
    },
    cash: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPayments: {
      type: Number,
      default: 0,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("PaymentSession", paymentSessionSchema);
