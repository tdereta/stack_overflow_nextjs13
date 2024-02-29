"use server"

import { connectToDatabase } from "@/lib/mongoose"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import {
    CreateQuestionParams, DeleteQuestionParams, EditQuestionParams,
    GetQuestionByIdParams,
    GetQuestionsParams,
    QuestionVoteParams, ToggleSaveQuestionParams
} from "@/lib/actions/shared.types"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"
import {usePathname} from "next/navigation";
import Interaction from "@/database/interaction.model"
import Answer from "@/database/answer.model"
import {FilterQuery} from "mongoose"

export async function getQuestions(params: GetQuestionsParams) {
    try {
        await connectToDatabase()

        const { searchQuery} = params;

        const query: FilterQuery<typeof Question> = {};

        if(searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i")}},
                { content: { $regex: new RegExp(searchQuery, "i")}},
            ]
        }

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
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
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

export async function upVoteQuestion(params: QuestionVoteParams) {
    try {
        await connectToDatabase()

        const { userId, questionId, hasUpVoted, hasDownVoted, path } = params

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

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

        if(!question) {
            throw new Error('Question not found')
        }

        // Increment author's reputation

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
    try {
        await connectToDatabase()

        const { userId, questionId, hasUpVoted, hasDownVoted, path } = params

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

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

        if(!question) {
            throw new Error('Question not found')
        }

        // Increment author's reputation

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        await connectToDatabase()

        const { questionId, path } = params

        await Question.deleteOne({_id: questionId})
        await Answer.deleteMany({ question: questionId })
        await Interaction.deleteMany({ question: questionId })
        await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId }})

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        await connectToDatabase()

        const { questionId, title, content, path } = params

        const question = await Question.findById(questionId)
            .populate("tags")

        if (!question) {
            throw new Error("Question not found")
        }

        question.title = title
        question.content = content

        await question.save()

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getHotQuestions(){
    try {
        await connectToDatabase()

        const hotQuestions = await Question.find({})
            .sort({views: -1, upVotes: -1})
            .limit(5)
        return hotQuestions

    } catch (error) {
            console.log(error)
            throw error
        }
    }
