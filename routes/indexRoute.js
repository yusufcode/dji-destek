const express = require('express')
const router = express.Router()

const ejs = require('ejs')
const fs = require("fs");
const nodeMailer = require('nodemailer')

const Pages = require('../models/Pages')
const DroneSeries = require('../models/DroneSeries')
const DroneModels = require('../models/DroneModels')
const DroneAltModels = require('../models/DroneAltModels')

router.get('/', (req, res) => {

    Pages.findOne({page: "index"}, (err, page) => {
        res.render('index', { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass })
    })

})

router.get('/teknik-servis/:droneSerial?/:droneModel?/:droneAltModel?', (req, res) => {

    const droneSerial = req.params.droneSerial
    const droneModel = req.params.droneModel
    const droneAltModel = req.params.droneAltModel
    let droneModelCode = ""

    Pages.findOne({page: "teknik-servis"}, (err, page) => {
        DroneSeries.findOne({url: droneSerial}, (err, droneSeries) => {
            DroneModels.findOne({url: droneModel}, (err, droneModels) => {
                if(droneAltModel) {droneModelCode = new RegExp('^' + droneModels.code)}
                DroneAltModels.findOne({url: droneAltModel, code: droneModelCode}, (err, droneAltModels) => {
                    
                    if(droneSerial && droneSeries) {
                        page.title = droneSeries.title
                        page.description = droneSeries.description
                        page.keywords = droneSeries.keywords
                    }
                    if(droneModel && droneModels) {
                        page.title = droneModels.title
                        page.description = droneModels.description
                        page.keywords = droneModels.keywords
                    }
                    if(droneAltModel && droneAltModels) {
                        page.title = droneAltModels.title
                        page.description = droneAltModels.description
                        page.keywords = droneAltModels.keywords
                    }
                
                    res.render('teknik-servis', { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, params: req.params, droneSerial: droneSeries, droneModel: droneModels, droneAltModel: droneAltModels })
                })
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

router.get('/404', (req, res) => {
    res.render('404', { title: "Sayfa Bulunamadı", bodyClass: "not-found navbar-backgrounded inner-page" })
})

router.get('/sitemap.xml', (req, res) => {
    fs.readFile('./views/sitemap.xml', (err, data) => {
        if (err) {
            console.log(err)
        } else{
            res.write(data)
        }
        res.end()
    })
})

router.get('*', (req, res) => {
    res.redirect('/404')
})


module.exports = router;