import { join } from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import ProductsModel from "../model/product.model.js";





export async function createProduct(req, reply) {
    try {
        const {
            title,
            price,
            quantity,
            content,
            discount = 0,
            image,
            category,
            options,
            brand,
            color,
            sizes,
        } = req.body;

        if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
            return reply.status(400).send({ message: "تصویر معتبر نیست" });
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const optimizedImageBuffer = await sharp(buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .jpeg({ quality: 80 })
            .toBuffer();


        const imageName = `${uuidv4()}.png`;
        const uploadPath = join(process.cwd(), "uploads", imageName);

        await fs.mkdir(join(process.cwd(), "uploads"), { recursive: true });
        await fs.writeFile(uploadPath, optimizedImageBuffer);


        const finalPrice = discount ? price - (price * discount) / 100 : price;
        const newProduct = new ProductsModel({
            title,
            price: Number(price),
            quantity: Number(quantity),
            content,
            discount: Number(discount),
            finalPrice: Number(finalPrice),
            image: `/uploads/${imageName}`,
            category,
            options,
            brand,
            color,
            sizes,
        });

        await newProduct.save();


        return reply.status(201).send({
            message: "محصول با موفقیت ثبت شد",
            product: newProduct,
        });

    } catch (error) {
        console.error("خطا در ثبت محصول:", error);
        return reply.status(500).send({ message: "خطا در سرور", error: error.message });
    }
}
export async function getProducts(req, reply) {
    try {
        const products = await ProductsModel.find({}, {
            createdAt: 0,
            updatedAt: 0
        });

        return reply.send({ products });
    } catch (error) {
        return reply
            .code(500)
            .send({ error: "مشکلی در سرور رخ داده است!" });
    }
}
export async function getProductById(req, reply) {
    try {
        const { id } = req.params;
        const product = await ProductsModel.findById(id, {
            createdAt: 0,
            updatedAt: 0,
        });

        if (!product) {
            return reply.status(404).send({ message: "محصول یافت نشد" });
        }

        return reply.send({ product });
    } catch (error) {
        console.error("خطا در گرفتن محصول:", error);
        return reply.status(500).send({ message: "خطا در سرور", error: error.message });
    }
}
export async function likePost(req, reply) {
    try {
        const { id } = req.params;
        const { liked } = req.body;
        if (!id) {
            return reply.code(400).send({ error: "شناسه محصول لازم است" });
        }

        const product = await ProductsModel.findById(id);
        if (!product) {
            return reply.code(404).send({ error: "محصول پیدا نشد" });
        }


        product.likes = liked ? product.likes + 1 : Math.max(0, product.likes - 1);
        await product.save();

        return reply.code(200).send({
            liked,
            likes: product.likes,
        });
    } catch (error) {
        console.error("خطا در لایک کردن:", error);
        return reply.code(500).send({ error: "خطایی در سرور رخ داد" });
    }
}
export async function getLikepost(req, reply) {
    try {
        const { id } = req.params
        const data = await ProductsModel.findById(id).select("likes");
        return reply.send({ likes: data.likes });
    } catch (error) {
        return reply
            .code(500)
            .send({ error: "مشکلی در سرور رخ داده است!" });
    }
}



export async function updateProducts(req, reply) {
    try {
        const { id } = req.params;
        const { image, sizes, color, options, ...updatedData } = req.body;

        console.log("ID:", id);
        console.log("Updated data:", JSON.stringify(req.body, null, 2));

        // بررسی معتبر بودن ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return reply.status(400).send({ message: "آیدی نامعتبر است" });
        }

        // پردازش تصویر اگر وجود داشته باشد
        if (image && image.startsWith("data:image/")) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            const optimizedImageBuffer = await sharp(buffer)
                .resize({ width: 800, height: 800, fit: "inside" })
                .jpeg({ quality: 80 })
                .toBuffer();

            const imageName = `${uuidv4()}.png`;
            const uploadPath = join(process.cwd(), "uploads", imageName);

            await fs.mkdir(join(process.cwd(), "uploads"), { recursive: true });
            await fs.writeFile(uploadPath, optimizedImageBuffer);

            updatedData.image = `/uploads/${imageName}`;
        } else if (image) {
            updatedData.image = image; // اگر تصویر به‌صورت URL یا مسیر باشد
        } else {
            updatedData.image = updatedData.image || null;
        }

        // پردازش sizes
        if (sizes) {
            updatedData.sizes = Array.isArray(sizes)
                ? sizes.map(Number).filter((n) => !isNaN(n))
                : sizes
                    .split(",")
                    .map((s) => Number(s.trim()))
                    .filter((n) => !isNaN(n));
        }

        // پردازش color
        if (color) {
            updatedData.color = Array.isArray(color)
                ? color.filter((c) => c)
                : color
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c);
        }

        // پردازش options
        if (options) {
            updatedData.options = Array.isArray(options) ? options : [];
        }

        // محاسبه قیمت نهایی
        if (updatedData.price && updatedData.discount !== undefined) {
            updatedData.finalPrice = updatedData.price - (updatedData.price * (updatedData.discount / 100));
        }

        // به‌روزرسانی محصول در پایگاه داده
        const product = await ProductsModel.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return reply.status(404).send({ message: "محصول یافت نشد" });
        }

        return reply.send({ product });
    } catch (error) {
        console.error("خطا در آپدیت محصول:", error);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message,
            }));
            return reply.status(400).send({
                message: "خطا در اعتبارسنجی داده‌ها",
                errors,
            });
        }

        return reply.status(500).send({
            message: "خطا در سرور",
            error: error.message,
        });
    }
}

export async function deleteProduct(req, reply) {
    try {
        const { id } = req.params;

        // بررسی معتبر بودن ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return reply.status(400).send({ message: 'آیدی نامعتبر است' });
        }

        // پیدا کردن و حذف محصول
        const product = await ProductsModel.findByIdAndDelete(id);

        if (!product) {
            return reply.status(404).send({ message: 'محصول یافت نشد' });
        }

        // حذف تصویر مرتبط اگر وجود دارد
        if (product.image) {
            const imagePath = join(process.cwd(), product.image);
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                console.warn('خطا در حذف تصویر:', error.message);
            }
        }

        return reply.send({ message: 'محصول با موفقیت حذف شد' });
    } catch (error) {
        console.error('خطا در حذف محصول:', error);
        return reply.status(500).send({
            message: 'خطا در سرور',
            error: error.message,
        });
    }
}