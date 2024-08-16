import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import User from '@/model/userModel';
import { browser } from 'process';

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
          
          var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "a95af137885099", //something wrong there
              pass: "********83d8" //something wrong there
            }
          });
          
          const mailOptions = {
            from: 'ankit.ankit@gmail.com', // sender address
            to: "email", // list of receivers
            subject: "emailType === 'VERIFY" ? "Verify your email" : "Reset our password", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
            ${emailType === "VERIFY" ? "verify you email" : "reset your password"}
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body
          }

          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}