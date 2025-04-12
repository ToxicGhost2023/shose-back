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