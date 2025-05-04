import { Schema, model } from "mongoose";

const ProductsSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: String, enum: ["مردانه", "زنانه", "کوهنوردی"], required: true },
        options: { type: [String], enum: ["رانینگ", "کوه‌نوردی", "فوتبال", "والیبال", "بسکتبال",] },
        quantity: { type: Number, required: true, min: 1 },
        sold: { type: Number, default: 0 },
        finalPrice: { type: Number },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        color: { type: [String], required: true },
        sizes: { type: [Number], required: true },
    },
    { timestamps: true }
);

const ProductsModel = model("Product", ProductsSchema);
export default ProductsModel;
