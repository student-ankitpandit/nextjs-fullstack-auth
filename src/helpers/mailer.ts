import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import User from '@/model/userModel';

export const sendEmail = async({email, emailType, userId}:any) =>
{
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

          if(emailType === "VERIFY") {
            await User.findByIdAndDelete(userId,
              {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}
            )
          } else if(emailType === "VERIFY"){
            await User.findByIdAndDelete(userId,
              {forgotPasswordtoken: hashedToken, forgotPasswordtokenExpiry: Date.now() + 3600000}
            )
          }


        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });


          const mailOptions = {
            from: 'ankit.ankit@gmail.com', // sender address
            to: "email", // list of receivers
            subject: "emailType === 'VERIFY" ? "Verify your email" : "Reset our password", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          }

          const mailResponse = await transporter.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}