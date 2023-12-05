"use server"

import { connectToDatabase } from "@/lib/mongoose"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "@/lib/actions/shared.types"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"

export async function getQuestions(params: GetQuestionsParams) {
    try {
        await connectToDatabase()

        const questions = await Question.find({})
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .sort({ createdAt: -1 })

        return { questions }

    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function createQuestion(params: CreateQuestionParams) {
    try {
        await connectToDatabase()

        const { title, content, tags, author, path } = params
        // Create question
        const question = await Question.create({
            title,
            content,
            author,
        })
        const tagDocuments = []
        // Create tags or get them if they already exist
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { question: question._id } },
                { upsert: true, new: true }
            )
            tagDocuments.push(existingTag._id)
        }
        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } },
        })
        revalidatePath(path)
        } catch (error) {
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        await connectToDatabase()

        const { questionId } = params

        const question = await Question.findById(questionId)
            .populate({ path: 'tags', model: Tag, select: '_id name' })
            .populate({ path: 'author', model: User, select: '_id clerkId name picture' })

        return question

    } catch (error) {
        console.log(error)
        throw error
    }
}

