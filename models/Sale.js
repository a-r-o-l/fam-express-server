import { Schema, model } from "mongoose";

const saleSchema = new Schema(
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
    account:{
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Sale", saleSchema);
