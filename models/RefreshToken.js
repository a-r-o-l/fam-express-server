import { Schema, model } from "mongoose";

const refreshSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    token:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    expiry_date:{
      type: Date,
      required: true,
    }
   
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("RefreshToken", refreshSchema);
