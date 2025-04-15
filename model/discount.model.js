import { Schema, model } from "mongoose";

const DiscountSchema = new Schema(
    {
        name: { type: String, required: true }, 
        discountPercentage: { type: Number, required: true, min: 0, max: 100 }, 
        active: { type: Boolean, default: true },
        appliesTo: { type: String, enum: ["all"], default: "all" }, 
    },
    { timestamps: true }
);

const DiscountModel = model("Discount", DiscountSchema);
export default DiscountModel;