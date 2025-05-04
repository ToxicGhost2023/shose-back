import { CheckOut, getAllorder, getCost, getProductForbarChart, getRemoveOrderById, updateOrderStatusAsync, updateStockAfterSale } from "../handlers/checkOut.handler.js";


const checkOutRoute = {
    schema: {
        tags: ["pay"],
        summary: "ثبت سفارش",
        body: {
            type: "object",
            required: ["userId", "firstName", "lastName", "phone", "address", "province", "city", "postalCode", "items"],
            properties: {
                userId: { type: "string" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
                province: { type: "string" },
                city: { type: "string" },
                postalCode: { type: "string" },
                items: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        required: ["productId", "price", "quantity",],
                        properties: {
                            productId: { type: "string" },
                            price: { type: "number" },
                            quantity: { type: "number" },
                            title: { type: "string" }
                        },
                    },
                },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    orderId: { type: "string" },
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
    handler: CheckOut,
};
const orderRoute = {
    schema: {
        tags: ["pay"],
        summary: "دریافت تمام سفارشات",
        response: {
            200: {
                type: "object",
                properties: {
                    orders: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                userId: { type: "string" },
                                firstName: { type: "string" },
                                lastName: { type: "string" },
                                phone: { type: "string" },
                                address: { type: "string" },
                                province: { type: "string" },
                                city: { type: "string" },
                                postalCode: { type: "string" },
                                totalAmount: { type: "number" },
                                status: { type: "string" },
                                items: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            productId: { type: "string" },
                                            price: { type: "number" },
                                            quantity: { type: "number" },
                                            totalPrice: { type: "number" },
                                            title: { type: "string" }
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    handler: getAllorder,
};
const barChartRoute = {
    schema: {
        tags: ["pay"],
        summary: "دریافت گزارش فروش برای نمودار",
        response: {
            200: {
                type: "object",
                properties: {
                    labels: { type: "array", items: { type: "string" } },
                    datasets: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                label: { type: "string" },
                                data: { type: "array", items: { type: "number" } },
                                backgroundColor: { type: "string" },
                                borderColor: { type: "string" },
                                borderWidth: { type: "number" },
                            },
                        },
                    },
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
    handler: getProductForbarChart,
};

const updatedOrderRoute = {
    schema: {
        tags: ["pay"],
        summary: "تغییر وضعیت سفارش",
        params: {
            type: "object",
            properties: {
                id: { type: "string" },
            },
            required: ["id"],
        },
        body: {
            type: "object",
            properties: {
                status: { type: "string" },
            },
            required: ["status"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    status: { type: "string" },
                    // سایر فیلدها اگر خواستی
                },
            },
            404: {
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
    handler: updateOrderStatusAsync,
};

const stockUpdateRoute = {
    schema: {
        tags: ["pay"],
        summary: "کاهش موجودی محصولات پس از فروش",
        body: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["productId", "quantity"],
                        properties: {
                            productId: { type: "string" },
                            quantity: { type: "number" },
                        },
                    },
                },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
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
    handler: updateStockAfterSale,
};


const deleteOrderRoute = {
    schema: {
        tags: ["pay"],
        summary: "حذف سفارش بر اساس شناسه",
        params: {
            type: "object",
            properties: {
                id: { type: "string" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    order: {
                        type: "object",
                        properties: {
                            _id: { type: "string" },
                            userId: { type: "string" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            phone: { type: "string" },
                            address: { type: "string" },
                            province: { type: "string" },
                            city: { type: "string" },
                            postalCode: { type: "string" },
                            totalAmount: { type: "number" },
                            status: { type: "string" },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        productId: { type: "string" },
                                        price: { type: "number" },
                                        quantity: { type: "number" },
                                        totalPrice: { type: "number" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            404: {
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
    handler: getRemoveOrderById,
};

const costRoute = {
    schema: {
        tags: ["pay"],
        summary: "محاسبه هزینه‌ها",
        response: {
            200: {
                type: "object",
                properties: {
                    dailyCost: { type: "number" },
                    monthlyCost: { type: "number" },
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
    handler: getCost,
};

export default function checkOutRoutes(fastify, options, done) {
    fastify.post("/checkOut", checkOutRoute);
    fastify.get("/cost", costRoute);
    fastify.get("/order", orderRoute);
    fastify.delete("/order/:id", deleteOrderRoute);
    fastify.patch("/order/:id", updatedOrderRoute);
    fastify.get("/barChart", barChartRoute);
    fastify.post("/update-stock", stockUpdateRoute);
    done();
}