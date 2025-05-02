import { Schema, model } from "mongoose";

const barChartSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
        unique: true,
    },
    brand: {
        type: String,
        default: "برند نامشخص",
    },
    totalSold: {
        type: Number,
        default: 0,
    },
    totalRevenue: {
        type: Number,
        default: 0,
    },
    lastSoldAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const barChartModel = model("barChart", barChartSchema);
export default barChartModel;
