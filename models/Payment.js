import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    description: {
      type: String,
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
    },
    type: {
      type: String,
    },
    receipt: {
      type: String,
    },
    payment_session: {
      type: Schema.Types.ObjectId,
      ref: "PaymentSession",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Payment", paymentSchema);
