import barChartModel from "../model/barChart.model.js";
import checkOutModel from "../model/checkOut.model.js";
import ProductsModel from "../model/product.model.js";
import storeModel from "../model/store.model.js";


export async function CheckOut(req, reply) {
    try {
        const { userId, firstName, lastName, phone, address, province, city, postalCode, items } = req.body;

        if (
            !userId || !firstName || !lastName || !phone || !address || !province ||
            !city || !postalCode || !items || !Array.isArray(items) || items.length === 0
        ) {
            return reply.status(400).send({ message: "لطفاً اطلاعات را کامل وارد کنید!" });
        }

        const cart = await storeModel.findOne({ userId, status: "active" });
        if (!cart || cart.items.length === 0) {
            return reply.status(400).send({ message: "سبد خرید خالی است" });
        }

        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await ProductsModel.findById(item.productId).lean();
                return {
                    productId: item.productId,
                    title: product?.title || "نامشخص",
                    price: item.price,
                    quantity: item.quantity,
                    totalPrice: item.price * item.quantity,
                };
            })
        );

        const totalAmount = enrichedItems.reduce((sum, item) => sum + item.totalPrice, 0);

        const order = await checkOutModel.create({
            userId,
            firstName,
            lastName,
            phone,
            address,
            province,
            city,
            postalCode,
            items: enrichedItems,
            totalAmount,
            status: "pending",
        });

        // آپدیت بارچارت
        for (const item of items) {
            const { productId, quantity, price, brand } = item;
            const total = quantity * price;


            const product = await ProductsModel.findById(productId);
            if (!product || product.quantity < quantity) {
                return reply.status(400).send({ message: `موجودی محصول «${product?.title || "نامشخص"}» کافی نیست.` });
            }

            await ProductsModel.findByIdAndUpdate(productId, {

                $inc: { quantity: -quantity, sold: quantity },
            });

            await barChartModel.findOneAndUpdate(
                { productId },
                {
                    $inc: {
                        totalSold: quantity,
                        totalRevenue: total,
                    },
                    $set: {
                        brand: brand || "برند نامشخص",
                        lastSoldAt: new Date(),
                    },
                },
                { upsert: true, new: true }
            );
        }

        // خالی کردن سبد خرید
        cart.items = [];
        cart.updatedAt = new Date();
        await cart.save();

        reply.status(200).send({
            status: "success",
            message: "سفارش با موفقیت ثبت شد",
            orderId: order._id,
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "مشکلی در سرور رخ داده است", error: error.message });
    }
}
// روت مربوط به نمدار پنل ادمین
export async function getProductForbarChart(req, reply) {
    try {
        const salesData = await barChartModel.find().populate("productId", "title"); // فرض بر اینکه productId رفرنسه

        const labels = salesData.map((sale) => sale.productId.title);
        const data = salesData.map((sale) => sale.totalSold);
        const revenue = salesData.map((sale) => sale.totalRevenue);

        reply.code(200).send({
            labels,
            datasets: [
                {
                    label: "تعداد فروش",
                    data,
                    backgroundColor: "#4CAF50",
                    borderColor: "#388E3C",
                    borderWidth: 1,
                },
                {
                    label: "درآمد",
                    data: revenue,
                    backgroundColor: "#2196F3",
                    borderColor: "#1976D2",
                    borderWidth: 1,
                },
            ],
        });
    } catch (error) {
        reply.code(500).send({
            message: "خطا در دریافت اطلاعات فروش",
            error: error.message,
        });
    }
}

export async function getAllorder(req, reply) {
    try {
        const orders = await checkOutModel.find().select("-__v -updatedAt -createdAt");

        reply.code(200).send({
            message: "سفارش‌ها با موفقیت دریافت شد",
            orders,
        });
    } catch (error) {
        reply.code(500).send({
            message: "خطا در دریافت سفارش‌ها",
            error: error.message,
        });
    }
}
export async function getRemoveOrderById(req, reply) {
    try {
        const { id } = req.params;

        // حذف سفارش با شناسه مشخص شده
        const order = await checkOutModel.findByIdAndDelete(id);

        if (!order) {
            return reply.status(404).send({ message: "سفارش پیدا نشد" });
        }

        reply.code(200).send({
            message: "سفارش با موفقیت حذف شد",
            order,
        });
    } catch (error) {
        reply.code(500).send({
            message: "خطا در حذف سفارش",
            error: error.message,
        });
    }
}
export async function updateOrderStatusAsync(req, reply) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await checkOutModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) return reply.code(404).send({ message: "یافت نشد" });

        return reply.code(200).send(updated);
    } catch (err) {
        return reply.code(500).send({ message: "خطا در سرور", error: err.message });
    }
}
export async function updateStockAfterSale(req, reply) {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return reply.status(400).send({ message: "لیست محصولات ارسال نشده است" });
        }

        for (const item of items) {
            const { productId, quantity } = item;

            const product = await ProductsModel.findById(productId);
            if (!product) {
                return reply.status(404).send({ message: `محصول با آیدی ${productId} پیدا نشد` });
            }

            if (product.quantity < quantity) {
                return reply.status(400).send({
                    message: `موجودی محصول «${product.title}» کافی نیست. موجودی فعلی: ${product.quantity}`
                });
            }

            await ProductsModel.findByIdAndUpdate(productId, {
                $inc: { quantity: -quantity, sold: quantity },
            });
        }

        reply.status(200).send({ message: "موجودی محصولات با موفقیت به‌روزرسانی شد" });

    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "خطا در سرور", error: error.message });
    }
}

export async function getCost(req, reply) {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const orders = await checkOutModel.find();

        const dailyOrders = orders.filter(order => new Date(order.createdAt) >= startOfDay);
        const dailyCost = dailyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const monthlyOrders = orders.filter(order => new Date(order.createdAt) >= startOfMonth);
        const monthlyCost = monthlyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        reply.code(200).send({
            dailyCost,
            monthlyCost,
            message: "هزینه‌ها با موفقیت محاسبه شد",
        });
    } catch (error) {
        reply.code(500).send({
            message: "خطا در محاسبه هزینه‌ها",
            error: error.message,
        });
    }
}