import { Schema, model } from "mongoose";

const OTPSchema = new Schema({
    code: { type: String, required: false, default: undefined },
    expiresIn: { type: Number, required: false, default: 0 },
});
const UserSchema = new Schema(
    {
        mobile: { type: String, unique: true, required: true },
        fullName: { type: String, unique: true, required: true, trim: true },
        otp: { type: OTPSchema },
        verifiedMobile: { type: Boolean, default: false, required: true },
        accessToken: { type: String },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

export const UserModel = model("user", UserSchema);
