import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export const emailAdapter = {
    async sendEmail(email: string, html: string) {
        try {
            let transport = nodemailer.createTransport(
                smtpTransport(
                    {
                        service: "gmail",
                        auth: {
                            user: process.env.MAIL,
                            pass: process.env.PASS,
                        },
                    })
            );

            transport.verify((error, success) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Ready for messages");
                    console.log(success);
                }
            });
            let info = await transport.sendMail(
                    {
                        from: 'Tarantino',
                        to: email,
                        subject: "Email confirmation code",
                        html: html
                    }
                )
            console.log(info, 'info')

        } catch (e) {
            console.log(e, 'error final grande')
        }
        // res.send({
        //     'email': req.body.email,
        //     'message': req.body.message,
        //     'subject': req.body.subject
        // })
    }
}