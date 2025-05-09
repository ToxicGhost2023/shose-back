import { join } from "path";
import { promises as fs } from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import ProductsModel from "../model/product.model.js";
import cache from "../utils/cache.js";

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

    if (
      !image ||
      typeof image !== "string" ||
      !image.startsWith("data:image/")
    ) {
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
    return reply
      .status(500)
      .send({ message: "خطا در سرور", error: error.message });
  }
}
export async function getProducts(req, reply) {
  try {
    const cached = cache.get("all_products");
    if (cached) {
      return reply.send(cached);
    }

    const products = await ProductsModel.find(
      {},
      {
        createdAt: 0,
        updatedAt: 0,
      }
    );

    cache.set("all_products", products);
    return reply.send(products);
  } catch (error) {
    return reply.code(500).send({ error: "مشکلی در سرور رخ داده است!" });
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
    return reply
      .status(500)
      .send({ message: "خطا در سرور", error: error.message });
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
    const { id } = req.params;
    const data = await ProductsModel.findById(id).select("likes");
    return reply.send({ likes: data.likes });
  } catch (error) {
    return reply.code(500).send({ error: "مشکلی در سرور رخ داده است!" });
  }
}

export const updateProducts = async (req, reply) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const product = await ProductsModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!product) {
      return reply.code(404).send({ message: "محصول پیدا نشد" });
    }

    return reply
      .code(200)
      .send({ message: "محصول با موفقیت بروزرسانی شد", product });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "خطا در بروزرسانی محصول" });
  }
};

export async function deleteProduct(req, reply) {
  try {
    const { id } = req.params;

    // بررسی معتبر بودن ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return reply.status(400).send({ message: "آیدی نامعتبر است" });
    }

    // پیدا کردن و حذف محصول
    const product = await ProductsModel.findByIdAndDelete(id);

    if (!product) {
      return reply.status(404).send({ message: "محصول یافت نشد" });
    }

    // حذف تصویر مرتبط اگر وجود دارد
    if (product.image) {
      const imagePath = join(process.cwd(), product.image);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.warn("خطا در حذف تصویر:", error.message);
      }
    }

    return reply.send({ message: "محصول با موفقیت حذف شد" });
  } catch (error) {
    console.error("خطا در حذف محصول:", error);
    return reply.status(500).send({
      message: "خطا در سرور",
      error: error.message,
    });
  }
}
