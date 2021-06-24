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
const PageBlog = require('../models/PageBlog')
const Blogs = require('../models/Blogs')
const DroneSeries = require('../models/DroneSeries')
const DroneModels = require('../models/DroneModels')
const DroneAltModels = require('../models/DroneAltModels')

router.get('/', (req, res) => {

    Pages.findOne({page: "index"}, (err, page) => {
        res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: page.seoText, layout: 'layouts/layout-seoText' })
        console.log(page.seoText)
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

router.get('/teknik-servis/:droneSerial?/:droneModel?/:droneAltModel?', async (req, res) => {

    const droneSerial = await req.params.droneSerial
    const droneModel = await req.params.droneModel
    const droneAltModel = await req.params.droneAltModel
    let seoText = ""

    let droneSeriesUrl = ""
    let droneModelsUrl = ""

    Pages.findOne({page: "teknik-servis"}, (err, page) => {

        seoText = page.seoText

        DroneSeries.findOne({url: droneSerial}, (err, droneSeries) => {

            if(droneSerial && !droneSeries) {
                res.redirect('/teknik-servis/')
            } else {

                if(droneModel) {droneSeriesUrl = droneSeries.url}
                
                DroneModels.findOne({url: droneModel, parentUrl: droneSeriesUrl}, (err, droneModels) => {
                
                    if(droneModel && !droneModels) {
                        res.redirect('/teknik-servis/'+droneSerial)
                    } else {

                        if(droneAltModel) {droneModelsUrl = droneModels.url}

                        DroneAltModels.findOne({url: droneAltModel, bigParentUrl: droneSeriesUrl, parentUrl: droneModelsUrl}, (err, droneAltModels) => {
                            
                            if(droneAltModel && !droneAltModels) {
                                res.redirect('/teknik-servis/'+droneSerial+'/'+droneModel)
                            } else {
                                
                                if(droneSerial && droneSeries) {
                                    page.title = droneSeries.title
                                    page.description = droneSeries.description
                                    page.keywords = droneSeries.keywords
                                    seoText = droneSeries.seoText
                                }
                                if(droneModel && droneModels) {
                                    page.title = droneModels.title
                                    page.description = droneModels.description
                                    page.keywords = droneModels.keywords
                                    seoText = droneModels.seoText
                                }
                                if(droneAltModel && droneAltModels) {
                                    page.title = droneAltModels.title
                                    page.description = droneAltModels.description
                                    page.keywords = droneAltModels.keywords
                                    seoText = droneAltModels.seoText
                                }
                            
                                res.render(page.page, { layout: 'layouts/layout-seoText', title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, params: req.params, droneSerial: droneSeries, droneModel: droneModels, droneAltModel: droneAltModels, seoText: seoText  })

                            }
                            
                        })

                    }
                    
                })   

            }        
            
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
    
    ejs.renderFile("./views/layouts/layout-mail.ejs", { mailInfo: mailInfo }, (err, data) => {
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
        res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: page.seoText, layout: 'layouts/layout-seoText' })
    })
})

router.get('/blog', (req, res) => {

    Pages.findOne({page: "blog"}, (err, page) => {
        PageBlog.findOne({ }, (err, pageBlog) => {
            Blogs.find({blogStatus: 1}, (err, blogData) => {
                res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, blog: blogData, seoText: page.seoText, layout: 'layouts/layout-seoText', blogColumnType: pageBlog.blogColumnType, blogMobileType: pageBlog.blogMobileType })
            }) 
        }) 
    })
})

router.get('/blog/:blogUrl', (req, res) => {

    const blogUrl = req.params.blogUrl

    Blogs.findOne({url: blogUrl, blogGeneralStatus: 1}, (err, blog) => {

        if (!blog) {
            res.redirect('/404')
        } else {

            Blogs.findOne({_id: {$lt: blog._id}, blogGeneralStatus: 1}, (err, previousBlog) => {
                Blogs.findOne({_id: {$gt: blog._id}, blogGeneralStatus: 1}, (err, nextBlog) => {
                    
                    const blogCreated = moment(blog.createdAt.getTime()).locale('tr').format('DD MMMM YYYY')
                    let blogEdited = moment(blog.updatedAt.getTime()).locale('tr').format('DD MMMM YYYY')
                    if(blogCreated == blogEdited) {blogEdited = 0}
                    res.render('blog-post', { title: blog.title, description: blog.description, keywords: blog.keywords, author: blog.author, bodyClass: blog.bodyClass, blog: blog, previousBlog: previousBlog, nextBlog: nextBlog, blogCreated: blogCreated, blogEdited: blogEdited })
                
                }).sort({_id: 1}).limit(1)
            }).sort({_id: -1}).limit(1)

        }

    })

})

router.get('/iletisim', (req, res) => {
    Pages.findOne({page: "iletisim"}, (err, page) => {
        res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: page.seoText, layout: 'layouts/layout-seoText' })
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
    
    ejs.renderFile("./views/layouts/layout-mail2.ejs", { mailInfo: mailInfo }, (err, data) => {
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