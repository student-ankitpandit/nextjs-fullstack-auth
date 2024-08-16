import { verify } from "crypto";
import mongoose from "mongoose";
import { stringify } from "querystring";

const userSchema = new mongoose.Schema({
    username: {
            type: string,
            required: [true, "Please provide a username"],
            unique: true
    },
    email: {
        type: string,
        required: [true, "Please provide a email"],
        unique: true
    },
    password: {
        type: string,
        required: [true, "Please provide a email"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordtoken: String,
    forgotPasswordtokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User