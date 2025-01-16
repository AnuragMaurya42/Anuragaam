import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    gender: { type: String, enum: ['male', 'female', 'others'] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Corrected casing
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, 
{ timestamps: true });

export const User = mongoose.model('User', userSchema);
