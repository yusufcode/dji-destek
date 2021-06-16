const express = require('express')
const router = express.Router()
const moment = require('moment')
const jwt = require('jsonwebtoken')

const maxAge = 60*60*24
const createToken = (id) => {
    return jwt.sign({id}, 'gizli kelime', {expiresIn: maxAge})
}

const ejs = require('ejs')
const fs = require("fs");
const nodeMailer = require('nodemailer')

const Users = require('../models/Users')
const Pages = require('../models/Pages')
const Blogs = require('../models/Blogs')
const DroneSeries = require('../models/DroneSeries')
const DroneModels = require('../models/DroneModels')
const DroneAltModels = require('../models/DroneAltModels')
const { exit } = require('process')

router.get('/', (req, res) => {

    Pages.findOne({page: "index"}, (err, page) => {
        res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass })
    })

})

router.get('/admin-giris', (req, res) => {
    
    if(req.cookies.jwt){
        res.redirect('/admin')
    } else {
        res.render('admin/login', {title: 'Giriş - DJI Destek', layout: false, bodyClass: 'admin-login-page'})
    }

})

router.post('/admin-kayit-ol', (req,res) => {

    const newUser = new Users({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        status: 0,
    })

    newUser.save((err,data) => {
        if (err) {
            console.log(err)
            res.send('0')
        } else{
            console.log(data)
            res.send('1')
        }
    })

})

router.post('/admin-giris-yap', async (req,res) => {

    const {email, password} = req.body

    try {
        const user = await Users.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {maxAge: maxAge * 1000})
        res.redirect('/admin')
    } catch(e) {
        console.log(e)
        res.send({
            status: false,
            message: e
        })
    }

})

router.get('/admin-cikis-yap', (req,res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/admin-giris')
})

router.get('/teknik-servis/:droneSerial?/:droneModel?/:droneAltModel?', (req, res) => {

    const droneSerial = req.params.droneSerial
    const droneModel = req.params.droneModel
    const droneAltModel = req.params.droneAltModel
    let droneSerialCode = ""
    let droneModelCode = ""

    Pages.findOne({page: "teknik-servis"}, (err, page) => {
        DroneSeries.findOne({url: droneSerial}, (err, droneSeries) => {
            
            if(droneModel) {droneSerialCode = new RegExp('^' + droneSeries.code)}
            DroneModels.findOne({url: droneModel, code: droneSerialCode}, (err, droneModels) => {
                if(droneModel && !droneModels) {res.redirect('/teknik-servis/'+droneSerial)}

                if(droneAltModel) {droneModelCode = new RegExp('^' + droneModels.code)}
                DroneAltModels.findOne({url: droneAltModel, code: droneModelCode}, (err, droneAltModels) => {
                    if(droneAltModel && !droneAltModels) {res.redirect('/teknik-servis/'+droneSerial+'/'+droneModel)}
                    
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
                
                    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, params: req.params, droneSerial: droneSeries, droneModel: droneModels, droneAltModel: droneAltModels })
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

router.get('/magaza', (req, res) => {
    Pages.findOne({page: "magaza"}, (err, page) => {
        res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass })
    })
})

router.get('/blog', (req, res) => {

    /*const newBlog = new Blogs({
        url: "dronelar-nasil-ucar",
        title: "Drone'lar Nasıl Uçar? - DJI Destek",
        description: "Bu blogumuzda drone'ların nasıl uçtuğundan bahsettik, keyifli okumalar.",
        keywords: "drone'lar nasıl uçar, drone uçma tekniği, drone'lar hakkında bilgiler, dji blog, dji destek",
        author: "Berat Akdemir",
        bodyClass: "inner-page navbar-backgrounded blog-post-page"
    })

    newBlog.save((err,data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    })*/

    Pages.findOne({page: "blog"}, (err, page) => {
        Blogs.find({blogStatus: 1}, (err, blogData) => {
            res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, blog: blogData })
        }) 
    })
})

router.get('/blog/:blogUrl', (req, res) => {

    const blogUrl = req.params.blogUrl

    Blogs.findOne({url: blogUrl, blogStatus: 1}, (err, blog) => {
        Blogs.findOne({url: {$lt: blogUrl}, blogStatus: 1}, (err, previousBlog) => {
            Blogs.findOne({url: {$gt: blogUrl}, blogStatus: 1}, (err, nextBlog) => {
                
                if (!blog) {
                    res.redirect('/404')
                } else {
                    const blogCreated = moment(blog.createdAt.getTime()).locale('tr').format('DD MMMM YYYY')
                    let blogEdited = moment(blog.updatedAt.getTime()).locale('tr').format('DD MMMM YYYY')
                    if(blogCreated == blogEdited) {blogEdited = 0}
                    res.render('blog-post', { title: blog.title, description: blog.description, keywords: blog.keywords, author: blog.author, bodyClass: blog.bodyClass, blog: blog, previousBlog: previousBlog, nextBlog: nextBlog, blogCreated: blogCreated, blogEdited: blogEdited })
                }

            }).sort({Id: -1}).limit(1)
        }).sort({Id: 1}).limit(1)
    })

})

router.get('/iletisim', (req, res) => {
    Pages.findOne({page: "iletisim"}, (err, page) => {
        res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass })
    })
})

router.post('/iletisim', (req, res) => {
 
    const transporter = nodeMailer.createTransport({
        host: "djidestek.com",
        port:465,
        secure: true,
        auth: {
            user: "iletisim@djidestek.com",
            pass: process.env.MAIL_2_PASSWORD
        },
        tls: {rejectUnauthorized: false}
    })

    let mailInfo = [{
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber,
        contactEmail: req.body.contactEmail,
        contactMessage: req.body.contactMessage
    }]

    console.log(mailInfo)
    
    ejs.renderFile("./views/layout-mail2.ejs", { mailInfo: mailInfo }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const mail = {
                from: "iletisim@djidestek.com",
                to: "yusuf1akbaba@gmail.com",
                subject: "Yeni Mesaj",
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

module.exports = router;