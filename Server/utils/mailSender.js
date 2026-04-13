const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body, replyTo = null) =>{
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            }
          })

          let mailOptions = {
            from: `StudyHub | CodeHelp <${process.env.MAIL_USER}>`, // sender address
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`, // plain text body
          };

          if (replyTo) {
            mailOptions.replyTo = replyTo;
          }

          let info = await transporter.sendMail(mailOptions);

            return info;
        
    } catch (error) {
        console.log("Error in mailSender", error.message);
        throw error; // Propagate error
    }
}

module.exports = mailSender;