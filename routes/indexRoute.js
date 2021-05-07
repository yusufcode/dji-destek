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
    /*
    console.log(req.body.contactName)
    */


    const transporter = nodeMailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: "yusuf1code@gmail.com",
            pass: "312YC46757274yc1"
        }
    })

    let droneSerialName = req.body.droneSerialName
    let droneModelName = req.body.droneModelName
    let droneAltModelName = req.body.droneAltModelName
    let problemTitle = req.body.problemTitle
    let problemText = req.body.problemText
    let contactName = req.body.contactName
    let contactNumber = req.body.contactNumber
    let contactEmail = req.body.contactEmail

    let mailInfo = [{
        droneSerialName: droneSerialName,
        droneModelName: droneModelName,
        droneAltModelName: droneAltModelName,
        problemTitle: problemTitle,
        problemText: problemText,
        contactName: contactName,
        contactNumber: contactNumber,
        contactEmail: contactEmail
    }]
    
    ejs.renderFile("./views/layout-mail.ejs", { mailInfo: mailInfo }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const mail = {
                from: "yusuf1code@gmail.com",
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

    res.redirect('/teknik-servis')
    
})

module.exports = router;