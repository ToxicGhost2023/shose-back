import { Schema, model } from "mongoose";

const ProductsSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        finalPrice: { type: Number },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        image: { type: String, required: true },
    },
    { timestamps: true }
);

const ProductsModel = model("Product", ProductsSchema);
export default ProductsModel;