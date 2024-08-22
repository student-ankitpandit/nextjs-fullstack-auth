import {connect} from '@/dbConfig/dbConfig'
import User from '@/model/userModel'
import { error } from 'console'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"


connect()

export async function POST(request: NextRequest) {
    try {
        //as always get the data from users
        const reqBody = await request.json()
        const {email, password} = reqBody()
        //validation
        console.log(reqBody);

        const user = await User.findOne({email})

        if(!user) {
            return NextResponse.json({error: "cannot find user"}, {status: 400})
        }

        console.log("user exits");

        //check credentials
        const validPassword = await bcryptjs.compare(password, user.password)

        if(!validPassword) {
            return NextResponse.json({error: "check your credentials"}, {status:400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

        //here i don't send the response right now
        const response = NextResponse.json({
            message: "Logged In Success",
            success: true
        })

        //user will see this cookies but can't change it
        response.cookies.set("token", token, {
            httpOnly: true
        })
        return response
        
    } catch (error:any) {
        //wahi hamara traditional next response
        return NextResponse.json({error: error.message}, {status: 500})
    }
}