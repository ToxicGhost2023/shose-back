import { createProduct, deleteProduct, getLikepost, getProductById, getProducts, likePost, updateProducts } from "../handlers/product.handler.js";

const createdRoute = {
    schema: {
        tags: ["Products"],
        summary: "ایجاد محصول جدید",
        body: {
            type: "object",
            properties: {
                title: { type: "string" },
                price: { type: "number" },
                quantity: { type: "number" },
                content: { type: "string" },
                discount: { type: "number" },
                finalPrice: { type: "number" },
                image: { type: "string", format: "binary" },
                category: { type: "string", enum: ["مردانه", "زنانه", "کوهنوردی"], },
                options: { type: "string", enum: ["رانینگ", "کوه‌نوردی", "فوتبال", "والیبال", "بسکتبال",] },
                brand: { type: "string" },
                color: {
                    type: "array",
                    items: { type: "string" },
                },
                sizes: {
                    type: "array",
                    items: { type: "number" },
                },
            },
            required: [
                "title",
                "price",
                "content",
                "category",
                "image",
                "brand",
                "color",
                "sizes"
            ],
        },
    },
    handler: createProduct,
};
const productAllRoute = {
    schema: {
        tags: ["Products"],
        summary: "دریافت تمام محصولات",
        response: {
            202: {
                type: "object",
            },
        },
    },
    handler: getProducts,
};


const productByIdRoute = {
    schema: {
        tags: ["Products"],
        summary: "دریافت جزییات یک محصول",
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
                    product: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            price: { type: "number" },
                            quantity: { type: "number" },
                            content: { type: "string" },
                            discount: { type: "number" },
                            finalPrice: { type: "number" },
                            image: { type: "string" },
                            category: { type: "string" },
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
        },
    },
    handler: getProductById,
};
const likePostRouter = {
    schema: {
        tags: ["Products"],
        summary: "لایک کردن محصول",
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
                    likes: { type: "number" },
                },
            },
            400: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
            404: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        },
    },
    handler: likePost,
};

const getLikeRouter = {
    schema: {
        tags: ["Products"],
        summary: "دریافت تمام لایک",
        params: {
            type: "object",
            properties: {
                id: { type: "string" },
            },
            required: ["id"],
        },
        response: {
            202: {
                type: "object",
                properties: {
                    likes: { type: "number" },
                },
            },
        },
    },
    handler: getLikepost,
};

const updateProductRoute = {
    schema: {
        tags: ["Products"],
        summary: "به‌روزرسانی محصول",
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
                title: { type: "string" },
                content: { type: "string" },
                category: { type: "string", enum: ["مردانه", "زنانه", "کوهنوردی"] },
                options: { type: "array", items: { type: "string", enum: ["رانینگ", "کوه‌نوردی", "فوتبال", "والیبال", "بسکتبال"] } },
                quantity: { type: "number", minimum: 1 },
                finalPrice: { type: "number" },
                price: { type: "number" },
                discount: { type: "number" },
                likes: { type: "number" },
                image: { type: "string" },
                brand: { type: "string" },
                color: { type: "array", items: { type: "string" } },
                sizes: { type: "array", items: { type: "number" } },
            },
        },
        response: {
            200: { type: "object" },
            404: { type: "object", properties: { message: { type: "string" } } },
        },
    },
    handler: updateProducts,
};
const deleteProductRoute = {
    schema: {
        tags: ["Products"],
        summary: "حذف یک محصول",
        params: {
            type: "object",
            properties: {
                id: { type: "string", description: "شناسه محصول" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string", description: "پیام موفقیت" },
                },
                example: {
                    message: "محصول با موفقیت حذف شد",
                },
            },
            404: {
                type: "object",
                properties: {
                    message: { type: "string", description: "پیام خطا" },
                },
                example: {
                    message: "محصول یافت نشد",
                },
            },
            500: {
                type: "object",
                properties: {
                    message: { type: "string", description: "پیام خطا" },
                    error: { type: "string", description: "جزئیات خطا" },
                },
                example: {
                    message: "خطا در سرور",
                    error: "متن خطا",
                },
            },
        },
    },
    handler: deleteProduct,
};
// const updateQuantityRoute = {
//     schema: {
//         tags: ["Products"],
//         summary: "به‌روزرسانی تعداد محصول",
//         params: {
//             type: "object",
//             properties: {
//                 id: { type: "string" },
//             },
//             required: ["id"],
//         },
//         body: {
//             type: "object",
//             properties: {
//                 quantity: { type: "number" }, // به جای stock
//             },
//             required: ["quantity"],
//         },
//         response: {
//             200: {
//                 type: "object",
//                 properties: {
//                     _id: { type: "string" },
//                     title: { type: "string" },
//                     quantity: { type: "number" }, // به جای stock
//                 },
//             },
//             404: {
//                 type: "object",
//                 properties: { message: { type: "string" } },
//             },
//             500: {
//                 type: "object",
//                 properties: { error: { type: "string" } },
//             },
//         },
//     },
//     handler: updateQuantityProducts,
// };

export default function productsRoutes(fastify, options, done) {
    fastify.post("/create", createdRoute);
    fastify.post("/:id/like", likePostRouter);
    fastify.get("/:id/like", getLikeRouter);
    fastify.get("/getAllProducts", productAllRoute);
    fastify.get("/:id", productByIdRoute);
    fastify.delete("/delete/:id", deleteProductRoute);
    fastify.put("/updateProduct/:id", updateProductRoute);
    // fastify.patch("/updateQuantity/:id", updateQuantityRoute);
    done();
}