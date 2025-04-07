import { login, logout, registerHandler, verifiedOTP } from "../handlers/auth.handler.js";

const registerRoute = {
    schema: {
        tags: ["authentication"],
        summary: " ثبت نام کاربر",
        body: {
            type: "object",
            properties: {
                mobile: {
                    type: "string",
                },
                fullName: {
                    type: "string",
                },
            },
        },
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: registerHandler,
};

const verifiedOTPRoutes = {
    schema: {
        tags: ["authentication"],
        summary: "اعتبار سنجی otp",
        body: {
            type: "object",
            properties: {
                otp: {
                    type: "string",
                },
            },
        },
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: verifiedOTP,
};

const loginRoute = {
    schema: {
        tags: ["authentication"],
        summary: "ورود کاربر",
        body: {
            type: "object",
            properties: {
                mobile: {
                    type: "string",
                },
            },
        },
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: login,
};
const logoutRoute = {
    schema: {
        tags: ["authentication"],
        summary: "خروج از حساب",
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: logout,
};



export default function authRouters(fastify, option, done) {
    fastify.post("/register", registerRoute);
    fastify.post("/verify-otp", verifiedOTPRoutes);
    fastify.post("/login", loginRoute);
    fastify.get("/logout", logoutRoute);

    done();
}