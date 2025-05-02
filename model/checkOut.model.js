import { Schema, model } from 'mongoose';

const checkOutSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, match: /^[0-9]{11}$/ },
    address: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true, match: /^[0-9]{10}$/ },
    items: [{
        productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const checkOutModel = model("Checkout", checkOutSchema);
export default checkOutModel;