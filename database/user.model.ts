import { Schema, models, model, Document } from "mongoose"

export interface IUser extends Document {
    clerkId: string
    name: string
    username: string
    email: string
    password?: string
    bio?: string
    picture: string
    location?: string
    portfolio?: string
    reputation?: number
    saved: Schema.Types.ObjectId[]
    joinDate: Date
}

const UserSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    bio: {
        type: String
    },
    picture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        required: true
    },
    location: {
        type: String
    },
    portfolio: {
        type: String
    },
    reputation: {
        type: Number,
        default: 0
    },
    saved: [{
        type: Schema.Types.ObjectId,
        ref: "Question"
    }],
    joinDate: {
        type: Date,
        default: Date.now
    }
})

const User = models.User || model("User", UserSchema)

export default User