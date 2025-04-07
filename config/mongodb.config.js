import fp from "fastify-plugin";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dbConnector(fastify, options) {
  const dbUrl = process.env.MONGODB_URL;

  if (!dbUrl) {
    fastify.log.error("❌ MONGODB_URL is not defined in .env");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // اتصال موفق
    fastify.decorate("mongoose", mongoose);
    fastify.log.info("✅✅✅✅✅ MongoDB connected");

    mongoose.connection.on("disconnected", () => {
      fastify.log.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      fastify.log.error("❌ MongoDB error:", err);
    });

  } catch (error) {
    fastify.log.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default fp(dbConnector);
