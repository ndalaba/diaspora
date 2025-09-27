import * as nodemailer from "nodemailer"
import * as dotenv from "dotenv"
import loggerUtils from "./logger.utils";

dotenv.config()

const transporter = nodemailer.createTransport({
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    //secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

const sendEmail = (to: string, subject: string, html: string, text: string = "") => {
    loggerUtils.info(`sending email to ${to}`)
    const data = {from: process.env.APP_EMAIL, to, subject, text, html}
    if (process.env.NODE_ENV !== "test")
        transporter.sendMail(data, (error:any, _:any) => {
            if (error)
                loggerUtils.error(error)
        })
}
export default sendEmail;