import Comment from "../model/comment.model.js";


export const getComments = async (request, reply) => {
    try {
        const comments = await Comment.find()
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 });
        return reply.status(200).send(comments);
    } catch (error) {
        return reply.status(500).send({ message: 'خطا در دریافت نظرات', error: error.message });
    }
};



export const createComment = async (request, reply) => {
    try {
        const { userId, comment } = request.body;
        if (!userId || !comment) {
            return reply.status(400).send({ message: 'همه فیلدها الزامی هستند' });
        }
        const newComment = await Comment.create({
            userId,
            comment,
            timestamp: new Date(),
        });
        return reply.status(201).send(newComment);
    } catch (error) {
        return reply.status(500).send({ message: 'خطا در ارسال نظر', error: error.message });
    }
};
export const getCommentById = async (request, reply) => {
    try {
        const { id } = request.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return reply.status(404).send({ message: 'نظر یافت نشد' });
        }
        return reply.status(200).send(comment);
    } catch (error) {
        return reply.status(500).send({ message: 'خطا در دریافت نظر', error: error.message });
    }
};