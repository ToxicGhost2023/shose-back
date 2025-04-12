import { getAllUsers, userCount, userDetails } from "../handlers/user.handler.js";


const userRoute = {
    schema: {
        tags: ["user"],
        summary: "جزییات کاربر",
        security: [{ apiKey: [] }],
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: userDetails,
};
const userCountRoute = {
    schema: {
        tags: ["user"],
        summary: "count user",
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: userCount,
};

const userAllRoute = {
    schema: {
        tags: ["user"],
        summary: "All user",
        response: {
            201: {
                type: "object",
            },
        },
    },
    handler: getAllUsers,
};






export default function userRouters(fastify, options, done) {
    fastify.get("/details", userRoute);
    fastify.get("/count", userCountRoute);
    fastify.get("/all", userAllRoute);
    done();
}