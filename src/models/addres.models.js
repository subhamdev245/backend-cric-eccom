import mongoose, { Schema } from "mongoose";
import { EcomProfile } from "./profile.models";

const addressSchema = new Schema(
  {
    customer: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "EcomProfile"
    },
    addressLine1: {
      required: true,
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
    country: {
      required: true,
      type: String,
    },
    owner: {
      ref: "EcomProfile",
      type: Schema.Types.ObjectId,
    },
    pincode: {
      required: true,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

addressSchema.plugin(mongooseAggregatePaginate);

export const Address = mongoose.model("Address", addressSchema);