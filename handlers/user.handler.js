import { UserModel } from "../model/user.model.js";




export const userDetails = async (req, reply) => {
    try {
        const authHeader = req.headers?.authorization;

        if (!authHeader) {
            return reply.status(401).send({ message: "Unauthorized" })
        }

        const token = authHeader.split(" ")[1];

        const decoded = await req.jwtVerify();

        const user = await UserModel.findById(decoded.userId).select("-otp");

        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }
        reply.header("Content-Type", "application/json; charset=utf-8");

        return reply.send(user);
    } catch (error) {
        return reply.status(401).send({ message: "Invalid token" });
    }
};
export const userCount = async (req, reply) => {
    try {
        const userCounts = await UserModel.countDocuments();
        return reply.send({ count: userCounts });
    } catch (error) {
        console.error("Error fetching user count:", error);
        return reply.code(500).send({ error: "Something went wrong!" });
    }
};
export const getAllUsers = async (req, reply) => {
    try {
        const users = await UserModel.find(
            {},
            { password: 0, _id: 0, verifiedMobile: 0, otp: 0, __v: 0 }
        );

        return reply.send({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return reply
            .code(500)
            .send({ error: "مشکلی در دریافت کاربران رخ داده است!" });
    }
};