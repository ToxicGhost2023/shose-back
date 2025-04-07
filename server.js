import Fastify from "fastify"
import dotenv from "dotenv";
dotenv.config();
// ----------------
import { fastifySwaggerConfig, fastifySwaggerUiConfig } from "./config/swagger.config.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
// --------------
import authRouters from "./routes/auth.routes.js";





// server
export const fastify = Fastify({ logger: true });
import dbConnector from "./config/mongodb.config.js";




const server = async () => {
    // ---------------دیتا بیس--------------------------------
    fastify.register(dbConnector);
    const port = process.env.PORT

    // ----------------authrazation----------------------------
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET_KEY,
    });

    fastify.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET_KEY,
    });
    // ------------------corsامنیت-----------------------------
    fastify.register(fastifyCors, {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],

        credentials: true,
        preflightContinue: true,
    });

    //----------------- سواگر-----------------------------------
    fastify.register(fastifySwagger, fastifySwaggerConfig);
    fastify.register(fastifySwaggerUi, fastifySwaggerUiConfig);

    // ------------------- روتها-----------------------------------
    fastify.register(authRouters, {
        prefix: "auth"
    })


    fastify.listen({ port }, (err) => {
        if (err) console.log(err);
        console.log(`🛜✅server roun on port http://localhost:${port}`);
    })

}
server()