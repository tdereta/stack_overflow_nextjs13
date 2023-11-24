import { Schema, models, model, Document } from "mongoose"

export interface IQuestion extends Document {
    title: string
    content: string
    tags: Schema.Types.ObjectId[]
    views: number
    upVotes: Schema.Types.ObjectId[]
    downVotes: Schema.Types.ObjectId[]
    author: Schema.Types.ObjectId
    answers: Schema.Types.ObjectId[]
    createdAt: Date
}

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    },
    views: {
        type: Number,
        default: 0
    },
    upVotes: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    downVotes: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    answers: {
        type: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Question = models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question