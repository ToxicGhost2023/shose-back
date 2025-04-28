

import { fastify } from "../server.js"
import { randomInt } from "crypto";
import dotenv from "dotenv"
import { UserModel } from "../model/user.model.js";
dotenv.config()

export const registerHandler = async (req, reply) => {
    try {
        const { mobile, fullName } = req.body;

        if (!mobile) return reply.status(400).send({ error: "شماره موبایل الزامیست" });
        if (!fullName) return reply.status(400).send({ error: "نام ونام خانوادگی موبایل الزامیست" });

        let user = await UserModel.findOne({ mobile });

        if (user) {
            return reply.send({ error: "این حساب قبلاً وجود دارد", status: 403 });
        }


        const now = new Date().getTime();
        const otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + 1000 * 60 * 2,
        };

        if (!user) {
            user = await UserModel.create({
                mobile,
                fullName,
                otp,
                verifiedMobile: false,
            });
        } else {
            return reply.send({ error: "این حساب قبلاً وجود دارد", status: 403 });
        }

        await user.save();
        reply.send({ otp: otp.code, message: "کد OTP ارسال شد" });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "خطای سرور", details: error.message });
    }
};

export const verifiedOTP = async (req, reply) => {
    try {
        const { otp } = req.body
        if (!otp) reply.status(400).send({ error: " لطفا رمز یبار مصرف را وارد کنید" });
        const user = await UserModel.findOne({ "otp.code": otp })
        if (!user) {
            return reply.status(400).send({ error: "رمز اشتباه می‌باشد" });
        }
        const now = new Date().getTime();
        if (user.otp.expiresIn < now) {
            return reply.status(400).send({ error: "کد OTP منقضی شده است" });
        }
        if (!user.verifiedMobile) {
            user.verifiedMobile = true;
        }
        const token = fastify.jwt.sign(
            {
                userId: user._id,
                role: user.role,
                mobile: user.mobile,
                fullName: user.fullName,
            },
            { expiresIn: "7d" }
        );
        user.otp = null;
        await user.save();
        reply
            .setCookie("accessToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                signed: false,
                sameSite: "lax",
                path: "/",
                domain: "",
                maxAge: 7 * 24 * 60 * 60, // مدت زمان انقضا کوکی
            })
            .send({
                status: 200,
                message: "موبایل با موفقیت تایید شد",
                token,
                user: {
                    mobile: user.mobile,
                    fullName: user.fullName,
                    lastLogin: new Date(),
                    role: user.role,
                    accessToken: user.accessToken,
                },
            });



    } catch (error) {
        reply.status(500).send({ error: "خطای سرور", details: error.message });
    }
}
export const login = async (req, reply) => {
    try {
        const { mobile } = req.body
        if (!mobile) {
            return reply.status(400).send({ error: "شماره موبایل الزامیس" });
        }
        const user = await UserModel.findOne({ mobile })
        if (!user) {
            return reply.status(400).send("   کاربر با این شماره و جود ندارد لطفا ابتدا حساب باز کنید");
        }
        if (!user.verifiedMobile) {
            return reply.status(403).send({ error: "شماره موبایل تأیید نشده است" });
        }
        const now = new Date().getTime();
        const otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + 1000 * 60 * 2,
        };
        user.otp = otp;

        await user.save();

        reply.send({ message: "کد OTP ارسال شد", otp: otp.code });

    } catch (error) {
        reply.status(500).send({ error: "خطای سرور", details: error.message });
    }


}
export const logout = async (req, reply) => {
    try {
        reply.clearCookie("accessToken", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });
        reply.send({ message: "Logged out successfully" });
    } catch (error) { }
};
