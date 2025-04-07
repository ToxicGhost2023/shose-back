export const fastifySwaggerConfig = {
  swagger: {
    info: {
      title: "fastify Swagger",
      description: "swagger: apies of shovers",
      version: "0.1.0",
    },
    tags: [
      { name: "authentication", description: "روت ثبت نام و ورود" },
      // { name: "user", description: "user can read & write (profile)" },
      // { name: "Products", description: "create product and get product" },
      // { name: "shop", description: "buy product" },
      // { name: "pay", description: "checkout product" },

    ],
    schemes: ["http"],
    consumes: ["application/json", "application/x-www-urlencoded"],

    securityDefinitions: {
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "authorization",
      },
    },
  },
};

export const fastifySwaggerUiConfig = {
  prefix: "swagger",
  exposeRoute: true,
};
