import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    name:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    profit:{
      type: Number,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Service", serviceSchema);
