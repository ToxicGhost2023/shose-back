import ProductsModel from "../model/product.model.js";
import DiscountModel from "../model/discount.model.js";

export async function applyFestivalDiscount(req, reply) {
  try {
    const { discountPercentage } = req.body;

    if (!discountPercentage || discountPercentage < 0 || discountPercentage > 100) {
      return reply.status(400).send({ message: "درصد تخفیف نامعتبر است" });
    }

 
    await DiscountModel.updateMany({}, { active: false });


    const discount = await DiscountModel.create({
      name: `تخفیف جشنواره‌ای ${new Date().toISOString().split("T")[0]}`,
      discountPercentage,
      active: true,
      appliesTo: "all",
    });


    await ProductsModel.updateMany(
      {},
      [
        {
          $set: {
            discount: discountPercentage,
            finalPrice: {
              $multiply: ["$price", { $subtract: [1, discountPercentage / 100] }],
            },
          },
        },
      ]
    );

    return reply.status(200).send({
      message: "تخفیف جشنواره‌ای با موفقیت اعمال شد",
      discount,
    });
  } catch (error) {
    console.error("خطا در اعمال تخفیف:", error);
    return reply.status(500).send({ message: "خطا در سرور", error: error.message });
  }
}

export async function deactivateFestivalDiscount(req, reply) {
  try {
    await DiscountModel.updateMany({}, { active: false });
    await ProductsModel.updateMany(
      {},
      [
        {
          $set: {
            discount: 0,
            finalPrice: "$price",
          },
        },
      ]
    );

    return reply.status(200).send({ message: "تخفیف جشنواره‌ای غیرفعال شد" });
  } catch (error) {
    console.error("خطا در غیرفعال‌سازی تخفیف:", error);
    return reply.status(500).send({ message: "خطا در سرور", error: error.message });
  }
}