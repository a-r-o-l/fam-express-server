import { Schema, model } from "mongoose";

const cashColsingSchema = new Schema(
  {
    coin: {
      type: Number,
    },
    ten: {
      type: Number,
    },
    twenty: {
      type: Number,
    },
    fifty: {
      type: Number,
    },
    houndred: {
      type: Number,
    },
    twoHoundred: {
      type: Number,
    },
    fiveHoundred: {
      type: Number,
    },
    thousand: {
      type: Number,
    },
    twoThousand: {
      type: Number,
    },
    tenThousand: {
      type: Number,
    },
    chachos: {
      type: Number,
    },
    total: {
        type: Number,
      },
    balance: {
      type: Number,
    },
    Profit: {
      type: Number,
    },
    account:{
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    sale_amount:{
      type: Number,
    },
    change:{
      type: Number,
    },
    date:{
        type: Date
      },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("CashClosing", cashColsingSchema);