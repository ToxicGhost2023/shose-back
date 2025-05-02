import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

// پکیج‌ها
import { fastifySwaggerConfig, fastifySwaggerUiConfig } from "./config/swagger.config.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

// روت‌ها
import authRouters from "./routes/auth.routes.js";
import userRouters from "./routes/user.routes.js";
import productsRoutes from "./routes/product.routes.js";
import discountRoutes from "./routes/dicount.routes.js";
import commentsRouter from "./routes/comments.routes.js";
import shopRoutes from "./routes/store.routes.js";
import checkOutRoutes from "./routes/checkOut.routes.js";
// ابزارها
import path from "path";
import { join } from 'path';
import { fileURLToPath } from "url";

// ساختن مسیر درست برای __dirname در ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ساخت سرور
export const fastify = Fastify({ logger: true });

// اتصال به دیتابیس
import dbConnector from "./config/mongodb.config.js";




// سرور اصلی
const server = async () => {
    const port = process.env.PORT || 3400;

    // اتصال به دیتابیس
    fastify.register(dbConnector);

    // تنظیم Static برای عکس‌ها
    fastify.register(fastifyStatic, {
        root: join(process.cwd(), 'uploads'),
        prefix: '/uploads/',
    });


    // JWT
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET_KEY,
    });

    // Cookie
    fastify.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET_KEY,
    });

    // CORS
    fastify.register(fastifyCors, {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        preflightContinue: true,
    });

    // Swagger
    fastify.register(fastifySwagger, fastifySwaggerConfig);
    fastify.register(fastifySwaggerUi, fastifySwaggerUiConfig);

    // روت‌ها
    fastify.register(authRouters, { prefix: "/auth" });
    fastify.register(userRouters, { prefix: "/user" });
    fastify.register(productsRoutes, { prefix: "/product" });
    fastify.register(discountRoutes, { prefix: "/alldicount" });
    fastify.register(commentsRouter, { prefix: "/comments" });
    fastify.register(shopRoutes, { prefix: "/shop" });
    fastify.register(checkOutRoutes, { prefix: "/pay" })

    // شروع سرور
    fastify.listen({ port }, (err, address) => {
        if (err) {
            console.error("❌ Server Error:", err);
            process.exit(1);
        }
        console.log(`🛜✅ Server running at: ${address}`);
    });
};

server();
