const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const app = express();
app.use(cors({origin: true}));

app.post("/", (req, res) => {
    const {body} = req;
    const isValidMessage = body.message && body.to && body.subject && body.html;

    if(!isValidMessage) {
        return res.status(400).send({ message: "Invalid request" });
    }

    const transporter = nodemailer.createTransport( {
        service: "Gmail",
        auth: {
            user: "closerpps@gmail.com",
            pass: "omjigzoysrcgqndo" //Contraseña de aplicación 2FA generada en la cuenta de Google, obligatoria desde el 30 de Mayo de 2022.
        }
    })

    const mailOptions = {
        from: "closerpps@gmail.com",
        to: body.to,
        subject: body.subject,
        text: body.message,
        html: body.html
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(mailOptions);       
            return res.status(500).send({ message: "error: " + JSON.stringify(err) });
        }
        return res.send({ message: "correo enviado" });
    });
});

module.exports.mailer = functions.https.onRequest(app);