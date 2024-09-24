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
      type : Schema.Types.ObjectId,
      ref: "Session",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Account", accountSchema);
