import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500,
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

const Comment = model('Comment', commentSchema);
export default Comment;
