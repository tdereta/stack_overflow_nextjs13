"use server"

import Answer from "@/database/answer.model"
import { connectToDatabase } from "../mongoose"
import {
    AnswerVoteParams,
    CreateAnswerParams, DeleteAnswerParams,
    GetAnswersParams,
} from "./shared.types"
import Question from "@/database/question.model"
import { revalidatePath } from "next/cache"
import Interaction from "@/database/interaction.model"

export async function createAnswer(params: CreateAnswerParams) {
    try {
        await connectToDatabase();

        const { content, author, question, path } = params;

        const newAnswer = await Answer.create({ content, author, question });

        // Add the answer to the question's answers array
        await Question.findByIdAndUpdate(question, {
            $push: { answers: newAnswer._id}
        })

        // TODO: Add interaction...

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAnswers(params: GetAnswersParams) {
    try {
        await connectToDatabase();

        const { questionId } = params;

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId name picture")
            .sort({ createdAt: -1 })

        return { answers };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function upVoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase()

        const { userId, answerId, hasUpVoted, hasDownVoted, path } = params

        let updateQuery = {}

        if(hasUpVoted) {
            updateQuery = { $pull: { upVotes: userId } }
        } else if(hasDownVoted) {
            updateQuery = {
                $pull: { downVotes: userId },
                $push: { upVotes: userId }}
        } else {
            updateQuery = { $addToSet: { upVotes: userId } }
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if(!answer) {
            throw new Error('Answer not found')
        }

        // Increment author's reputation

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function downVoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase()

        const { userId, answerId, hasUpVoted, hasDownVoted, path } = params

        let updateQuery = {}

        if(hasDownVoted) {
            updateQuery = { $pull: { downVotes: userId } }
        } else if(hasUpVoted) {
            updateQuery = {
                $pull: { upVotes: userId },
                $push: { downVotes: userId }}
        } else {
            updateQuery = { $addToSet: { downVotes: userId } }
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if(!answer) {
            throw new Error('Answer not found')
        }

        // Increment author's reputation

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        await connectToDatabase()

        const { answerId, path } = params

        const answer = await Answer.findById(answerId)

        if(!answer) {
            throw new Error('Answer not found')
        }

        await Answer.deleteOne({ _id: answerId })
        await Question.updateMany({ _id: answerId }, { $pull: { answer: answerId }})
        await Interaction.deleteMany({ answer: answerId })

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}