const express = require('express')
const router = express.Router()

const ejs = require('ejs')
const fs = require("fs");
const nodeMailer = require('nodemailer')

const DroneSeries = require('../models/DroneSeries')
const DroneModels = require('../models/DroneModels')
const DroneAltModels = require('../models/DroneAltModels')

router.get('/', (req, res) => {
    res.render('index', { title: "", bodyClass: "" })
})

router.get('/sitemap', (req, res) => {
    fs.readFile('./views/sitemap.html', (err, data) => {
        if (err) {
            console.log(err)
        } else{
            res.write(data)
        }
        res.end()
    })
})

router.get('/teknik-servis/:droneSerial?/:droneModel?/:droneAltModel?', (req, res) => {

    const droneSerial = req.params.droneSerial
    const droneModel = req.params.droneModel
    const droneAltModel = req.params.droneAltModel

    DroneSeries.findOne({url: droneSerial}, (err, droneSeries) => {
        DroneModels.findOne({url: droneModel}, (err, droneModels) => {
            DroneAltModels.findOne({url: droneAltModel}, (err, droneAltModels) => {
                res.render('teknik-servis', { title: "Teknik Servis", bodyClass: "technic-service-page navbar-backgrounded", params: req.params, droneSerial: droneSeries, droneModel: droneModels, droneAltModel: droneAltModels })
            })    
        })
    })

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

    console.log(mailInfo)
    
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
                    res.redirect('/?mail=failed')
                } else {
                    console.log('Mail sent!')
                    res.redirect('/?mail=sent')
                }
            })

        }
    });
    
})

router.get('*', (req, res) => {
    res.render('404', { title: "404", bodyClass: "not-found navbar-backgrounded" })
})

module.exports = router;