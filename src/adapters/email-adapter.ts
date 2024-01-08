import smtpTransport from "nodemailer-smtp-transport";
import nodemailer from "nodemailer";
import { UserDBType } from "../dto/usersDTO/usersDTO";
import * as dotenv from "dotenv";

dotenv.config();
const emailSender = process.env.AUTH_EMAIL;
const appPassword = process.env.AUTH_PASSWORD;

export const emailAdapter = {
  async sendEmail(email: string, html: string) {
    try {
      let transport = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          auth: {
            user: emailSender,
            pass: appPassword,
          },
        })
      );
      let mailOptions = {
        from: "Tarantino",
        to: email,
        subject: "Email confirmation code",
        html,
      };
      transport.verify((error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Ready for messages");
          console.log(success);
        }
      });

      transport.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.log("Email not sent");
      console.log(error);
    }
  },
  async sendConfirmationEmail(user: UserDBType) {},
};
