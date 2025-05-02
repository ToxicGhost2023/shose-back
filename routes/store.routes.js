// routes/shop.js

import { addToCart, getCart, removeFromCart, clearCart } from "../handlers/store.handler.js";




const getCartRoute = {
    schema: {
        tags: ["shop"],
        summary: "دریافت سبد خرید کاربر",
        querystring: {
            type: "object",
            properties: {
                userId: { type: "string" },
            },
            required: ["userId"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    cart: {
                        type: "object",
                        properties: {
                            userId: { type: "string" },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        productId: { type: "string" },
                                        quantity: { type: "number" },
                                        price: { type: "number" },
                                        title: { type: "string" },
                                        image: { type: "string" },
                                    },
                                },
                            },
                            status: { type: "string" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                },
            },
            400: {
                type: "object",
                properties: { error: { type: "string" } },
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    details: { type: "string" },
                },
            },
        },
    },
    handler: getCart,
};

const addToCartRoute = {
    schema: {
        tags: ["shop"],
        summary: "افزودن محصول به سبد خرید",
        body: {
            type: "object",
            properties: {
                userId: { type: "string" },
                productId: { type: "string" },
                quantity: { type: "number" },
                price: { type: "number" },
            },
            required: ["userId", "productId", "price"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    cart: {
                        type: "object",
                        properties: {
                            userId: { type: "string" },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        productId: { type: "string" },
                                        quantity: { type: "number" },
                                        price: { type: "number" },
                                        title: { type: "string" },
                                        image: { type: "string" },
                                    },
                                },
                            },
                            status: { type: "string" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                    totalPrice: { type: "number" },
                },
            },
            400: {
                type: "object",
                properties: { error: { type: "string" } },
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    details: { type: "string" },
                },
            },
        },
    },
    handler: addToCart,
};

const removeFromCartRoute = {
    schema: {
        tags: ["shop"],
        summary: "حذف محصول از سبد خرید",
        params: {
            type: "object",
            properties: {
                productId: { type: "string" },
            },
            required: ["productId"],
        },
        body: {
            type: "object",
            properties: {
                userId: { type: "string" },
            },
            required: ["userId"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    cart: {
                        type: "object",
                        properties: {
                            userId: { type: "string" },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        productId: { type: "string" },
                                        quantity: { type: "number" },
                                        price: { type: "number" },
                                        title: { type: "string" },
                                        image: { type: "string" },
                                    },
                                },
                            },
                            status: { type: "string" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                },
            },
            400: {
                type: "object",
                properties: { error: { type: "string" } },
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    details: { type: "string" },
                },
            },
        },
    },
    handler: removeFromCart,
};
const clearCartRoute = {
    schema: {
        tags: ["shop"],
        summary: "خالی کردن سبد خرید کاربر",
        querystring: {
            type: "object",
            properties: {
                userId: { type: "string" },
            },
            required: ["userId"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    deletedCount: { type: "integer" },
                },
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    details: { type: "string" },
                },
            },
        },
    },
    handler: clearCart, // این متد هندلرت که خودت مینویسی
};


export default function shopRoutes(fastify, options, done) {
    fastify.get("/get", getCartRoute);
    fastify.post("/add", addToCartRoute);
    fastify.post("/clear", clearCartRoute);
    fastify.delete("/remove/:productId", removeFromCartRoute);

    done();
}