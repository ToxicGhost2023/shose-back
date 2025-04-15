import { applyFestivalDiscount, deactivateFestivalDiscount } from "../handlers/discount.handler.js";

const applyDiscountRoute = {
    schema: {
        tags: ["alldicount"],
        summary: "اعمال تخفیف جشنواره‌ای برای همه محصولات",
        body: {
            type: "object",
            properties: {
                discountPercentage: { type: "number", minimum: 0, maximum: 100 },
            },
            required: ["discountPercentage"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    discount: { type: "object" },
                },
            },
            400: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    error: { type: "string" },
                },
            },
        },
    },
    handler: applyFestivalDiscount,
};

const deactivateDiscountRoute = {
    schema: {
        tags: ["alldicount"],
        summary: "غیرفعال کردن تخفیف جشنواره‌ای",
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    error: { type: "string" },
                },
            },
        },
    },
    handler: deactivateFestivalDiscount,
};

export default function discountRoutes(fastify, options, done) {
    fastify.post("/on", applyDiscountRoute);
    fastify.post("/off", deactivateDiscountRoute);
    done();
}