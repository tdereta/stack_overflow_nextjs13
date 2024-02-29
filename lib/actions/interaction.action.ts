"use server"

import {ViewQuestionParams} from "@/lib/actions/shared.types"
import {connectToDatabase} from "@/lib/mongoose"
import Interaction from "@/database/interaction.model"
import Question from "@/database/question.model"

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        await connectToDatabase()

        const { userId, questionId, path } = params

        // Update view count for the question
        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

        if (userId) {
            const existingInteraction = await Interaction.findOne({
                question: questionId,
                user: userId,
                action: 'view'
            })

            if (existingInteraction) {
               return console.log('User already viewed.')
                }
            // Create new interaction
            await Interaction.create({
                question: questionId,
                user: userId,
                action: 'view'
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}