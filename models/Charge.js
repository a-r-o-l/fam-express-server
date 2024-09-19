import { Schema, model } from "mongoose";

const chargeSchema = new Schema(
  {
    amount: {
      type: Number,
    },
    date: {
      type: Date,
    },
    service:{
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Charge", chargeSchema);
