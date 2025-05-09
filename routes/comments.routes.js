import { createComment, getComments } from "../handlers/comments.handler.js";


const createdRoute = {
    schema: {
        tags: ["Comments"],
        summary: "ایجاد کامنت  جدید",
        body: {
            type: "object",
            properties: {
                userId: { type: 'string' },
                comment: { type: 'string' },
            },
            required: ['userId', 'comment'],
        },
    },
    handler: createComment,
};
const getAllCommentRoute = {
    schema: {
        tags: ['Comments'],
        summary: 'دریافت تمام نظرات سایت',
    },
    handler: getComments,
};



export default function commentsRouter(fastify, options, done) {
    fastify.post("/create", createdRoute);
    fastify.get("/getAllComments", getAllCommentRoute);

    done();
}