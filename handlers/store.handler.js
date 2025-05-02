import storeModel from "../model/store.model.js";





export async function addToCart(req, reply) {
    const { userId, productId, quantity, price } = req.body;
    if (!userId || !productId || !quantity || !price) {
        return reply.status(400).send({ error: "داده‌های ورودی نامعتبر" });
    }

    try {
        let cart = await storeModel.findOne({ userId, status: "active" });
        if (!cart) {
            cart = new storeModel({
                userId,
                items: [],
                status: "active",
            });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].totalPrice = quantity * price;
        } else {
            cart.items.push({
                productId,
                quantity,
                price,
                totalPrice: quantity * price,
            });
        }

        cart.updatedAt = new Date();
        await cart.save();

        return reply.status(200).send({ cart });
    } catch (error) {
        console.error("Add to cart error:", error);
        return reply.status(500).send({ error: "مشکلی در سرور رخ داده است" });
    }
}

export async function getCart(req, reply) {
    const { userId } = req.query;

    try {
        const cart = await storeModel.findOne({ userId, status: "active" });
        if (!cart) {
            return reply.send({ cart: { items: [] } });
        }
        return reply.send({ cart });
    } catch (error) {
        return reply.code(500).send({ error: "خطا در دریافت سبد", details: error.message });
    }
}
// حذف کل محصول در سبد خرید
export async function clearCart(req, reply) {
    const { userId } = req.body;

    if (!userId) {
        return reply.status(400).send({ error: "آیدی کاربر نامعتبر" });
    }

    try {
        const cart = await storeModel.findOne({ userId, status: "active" });
        if (!cart) {
            return reply.status(200).send({ message: "سبد خرید قبلاً خالی است" });
        }

        cart.items = [];
        cart.updatedAt = new Date();
        await cart.save();

        return reply.status(200).send({ message: "سبد خرید با موفقیت خالی شد" });
    } catch (error) {
        console.error("Clear cart error:", error);
        return reply.status(500).send({ error: "مشکلی در سرور رخ داده است" });
    }
}
// حذف تکی
export async function removeFromCart(req, reply) {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!productId || !userId) {
        return reply.code(400).send({ error: "داده‌های ورودی نامعتبر" });
    }

    try {
        const cart = await storeModel.findOne({ userId, status: "active" });
        if (!cart) {
            return reply.code(404).send({ error: "سبد خرید پیدا نشد" });
        }
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        cart.updatedAt = new Date();
        await cart.save();
        return reply.send({ message: "محصول حذف شد", cart });
    } catch (error) {
        return reply.code(500).send({ error: error.message });
    }
}