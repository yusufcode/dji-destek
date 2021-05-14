const express = require('express')
const router = express.Router()

const ejs = require('ejs')
const fs = require("fs");
const nodeMailer = require('nodemailer')

router.get('/', (req, res) => {
    res.render('index', { title: "", bodyClass: "" })
})

router.get('/teknik-servis', (req, res) => {
    res.render('teknik-servis', { title: "Teknik Servis", bodyClass: "technic-service-page navbar-backgrounded" })
})

router.post('/teknik-servis', (req, res) => {
 
    const transporter = nodeMailer.createTransport({
        host: "djidestek.com",
        port:465,
        secure: true,
        auth: {
            user: "teknikservis@djidestek.com",
            pass: process.env.MAIL_1_PASSWORD
        },
        tls: {rejectUnauthorized: false}
    })

    let mailInfo = [{
        droneSerialName: req.body.droneSerialName,
        droneModelName: req.body.droneModelName,
        droneAltModelName: req.body.droneAltModelName,
        problemTitle: req.body.problemTitle,
        problemText: req.body.problemText,
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber,
        contactEmail: req.body.contactEmail
    }]
    
    ejs.renderFile("./views/layout-mail.ejs", { mailInfo: mailInfo }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const mail = {
                from: "teknikservis@djidestek.com",
                to: "yusuf1akbaba@gmail.com",
                subject: "Teknik Servis Başvurusu",
                html: data
            }

            transporter.sendMail(mail, (err) => {
                if (err) {
                    console.log('Mail could not send! Error:' + err)
                } else {
                    console.log('Mail sent!')
                }
            })

        }
    });
    
})

router.get('*', (req, res) => {
    res.render('404', { title: "404", bodyClass: "not-found navbar-backgrounded" })
})

module.exports = router;