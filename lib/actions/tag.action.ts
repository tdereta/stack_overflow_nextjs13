"use server"
import { connectToDatabase } from "@/lib/mongoose"
import {GetAllTagsParams, GetTopInteractedTagsParams} from "./shared.types"
import User from "@/database/user.model"
import Tag from "@/database/tag.model"
import { FilterQuery} from "mongoose"

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase()

        const { userId} = params

        const user = await User.findById(userId)

        if(!user) throw new Error('User not found')

        // Find interactions for the user and group by tags
        // Interaction...
        return [{_id: '1', name: 'tag1'}, {_id: '2', name: 'tag2'}]

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        await connectToDatabase()

        const tags = await Tag.find({})

        return {tags}

    } catch (error) {
        console.log(error)
        throw error
    }
}