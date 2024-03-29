"use server"

import {connectToDatabase} from "@/lib/mongoose"
import User from "@/database/user.model"
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams,
    ToggleSaveQuestionParams,
    UpdateUserParams, GetUserStatsParams
} from "@/lib/actions/shared.types"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model";
import {FilterQuery} from "mongoose";
import Answer from "@/database/answer.model";

export async function getUserById(params: any) {
    try {
        await connectToDatabase()

        const { userId } = params
        const user = await User.findOne({ clerkId: userId })
        return user

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        await connectToDatabase()

        const newUser = await User.create(userData)
        return newUser

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        await connectToDatabase();

        const { clerkId, updateData, path } = params;

        await User.findOneAndUpdate({ clerkId }, updateData, {
            new: true,
        });

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        await connectToDatabase()

        const { clerkId } = params

        const user = await User.findOneAndDelete({ clerkId })

        if(!user) {
            throw new Error('User not found')
        }

        // Delete all questions ids created by this user
        const userQuestionIds = await Question.find({ author: user._id }).distinct('_id')

        // delete user questions
        await Question.deleteMany({ author: user._id })

        const deletedUser = await User.findByIdAndDelete(user._id)
        return deletedUser

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        await connectToDatabase()

       // const { page = 1, pageSize = 20, filter, searchQuery } = params
        const users = await User.find({})
            .sort({ createdAt: -1 })

        return { users }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {

    try {
        await connectToDatabase()

        const {userId, questionId, path} = params

        const user = await User.findById(userId)

        if(!user) {
            throw new Error ('User not found')
        }

        const isSavedQuestion = user.saved.includes(questionId)

        if(isSavedQuestion) {
           await User.findByIdAndUpdate(userId,
               { $pull: { saved: questionId }},
               { new: true })
        } else {
            await User.findByIdAndUpdate(userId,
                { $addToSet: { saved: questionId } },
                { new: true }
            )
        }

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        await connectToDatabase()

        const {clerkId, page = 1, pageSize = 10, filter, searchQuery } = params

        const query: FilterQuery<typeof Question> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, 'i') } }
            : { }

        const user = await User.findOne({clerkId}).populate({
            path: 'saved',
            match: query,
            options: {
                sort: { createdAt: -1 },
            },
            populate: [
                { path: 'tags', model: Tag, select: '_id name' },
                { path: 'author', model: User, select: '_id clerkId name picture' },
            ]
        })
        if(!user) {
            throw new Error('User not found')
        }

        const savedQuestions = user.saved
        return { questions: savedQuestions }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        await connectToDatabase()

        const { userId } = params

        const user = await User.findOne({ clerkId: userId })

        if(!user) {
            throw new Error('User not found')
        }

        const totalQuestions = await Question.countDocuments({ author: user._id })
        const totalAnswers = await Answer.countDocuments({ author: user._id })

        return { user, totalQuestions, totalAnswers }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        await connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;

        const totalQuestions = await Question.countDocuments({ author: userId})

        const userQuestions = await Question.find({ author: userId })
            .sort({ views: -1, upVotes: -1 })
            .populate('tags', '_id name')
            .populate('author', '_id clerkId name picture')

        return { totalQuestions, questions: userQuestions };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        await connectToDatabase()

        const { userId, page = 1, pageSize = 10 } = params

        const totalAnswers = await Answer.countDocuments({ author: userId })

        const userAnswers = await Answer.find({ author: userId })
            .sort({ upVotes: -1 })
            .populate('question', '_id title')
            .populate('author', '_id clerkId name picture')

        return { totalAnswers, answers: userAnswers }

    } catch (error) {
        console.log(error)
        throw error
    }
}