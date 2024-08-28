import {connect} from '@/dbConfig/dbConfig'
import User from '@/model/userModel'
import { error, log } from 'console'
import next from 'next'
import {NextRequest, NextResponse} from 'next/server'
import { json } from 'stream/consumers'
import  bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody //this reqBody is a promise

        //discuss validation
        console.log(reqBody);

        const user = await User.findOne({email})

        if(user) {
            return NextResponse.json({error: "User already exist"}, {status: 500})
        }
        
        //async bcryptjs
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        //send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        })

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {
            status: 500
        })
        
    }
}