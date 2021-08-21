const express = require('express')
const router = express.Router()
const moment = require('moment')
const jwt = require('jsonwebtoken')

const maxAge = 60*60*24
const createToken = (id) => {
    return jwt.sign({id}, 'gizli kelime', {expiresIn: maxAge})
}

const ejs = require('ejs')
const fs = require('fs');
const nodeMailer = require('nodemailer')

const Users = require('../models/Users')
const Pages = require('../models/Pages')
const PageBlog = require('../models/PageBlog')
const Blogs = require('../models/Blogs')
const DroneSeries = require('../models/DroneSeries')
const DroneModels = require('../models/DroneModels')
const DroneAltModels = require('../models/DroneAltModels')
const Products = require('../models/Products')
const favoriteBlogsMiddleware = require('../middlewares/favoriteBlogsMiddleware')


router.get('/', favoriteBlogsMiddleware, async (req, res) => {

    const page = await Pages.findOne({page: "index"}) 
    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: page.seoText, favoriteBlogs: req.favoriteBlogs })

})

router.get('/admin-giris', (req, res) => {
    
    if(req.cookies.jwt){
        res.redirect('/admin')
    } else {
        res.render('admin/login', {title: 'Giriş - DJI Destek', layout: false, bodyClass: 'admin-login-page'})
    }

})

/* sign up to admin panel */
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

/* login to admin panel */
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

router.get('/teknik-servis/:droneSerial?/:droneModel?/:droneAltModel?', favoriteBlogsMiddleware, async (req, res) => {

    const droneSerial = await req.params.droneSerial
    const droneModel = await req.params.droneModel
    const droneAltModel = await req.params.droneAltModel
    let seoText = ""

    let droneSeriesUrl = ""
    let droneModelsUrl = ""

    const page = await Pages.findOne({page: "teknik-servis"})

    seoText = page.seoText

    const droneSeries = await DroneSeries.findOne({url: droneSerial})

    if(droneSerial && !droneSeries) {
        res.redirect('/teknik-servis/')
    } 

    if(droneModel) {
        droneSeriesUrl = droneSeries.url
    }
    
    const droneModels = await DroneModels.findOne({url: droneModel, parentUrl: droneSeriesUrl})  
    
    if(droneModel && !droneModels) {
        res.redirect('/teknik-servis/'+droneSerial)
    }

    if(droneAltModel) {
        droneModelsUrl = droneModels.url
    }

    const droneAltModels = await DroneAltModels.findOne({url: droneAltModel, bigParentUrl: droneSeriesUrl, parentUrl: droneModelsUrl})     
        
    if(droneAltModel && !droneAltModels) {
        res.redirect('/teknik-servis/'+droneSerial+'/'+droneModel)
    }
        
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

    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, params: req.params, droneSerial: droneSeries, droneModel: droneModels, droneAltModel: droneAltModels, seoText: seoText, favoriteBlogs: req.favoriteBlogs  })

})

/* send mail in teknik servis page */
router.post('/teknik-servis', async (req, res) => {

    let mailInfo = await [req.body]

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
    
    ejs.renderFile("./views/layouts/layout-mail.ejs", { mailInfo: mailInfo }, async (err, data) => {
        
        const mail = await {
            from: "teknikservis@djidestek.com",
            to: "yusuf1code@gmail.com",
            subject: "Teknik Servis Başvurusu: " + req.body.problemTitle + "",
            html: data
        }

        transporter.sendMail(mail, async (err, data) => {

            const nameArray = req.body.costomerName.split(' ')
            let nameUppercased = []
            for (let i = 0; i < nameArray.length; i++) {
                nameUppercased[i] = nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1)
            }
            const nameRevised = nameUppercased.join(' ')
            
            if(err){
                res.send({
                    status: false,
                    message: "Sevgili müşterimiz " + nameRevised + ", mesajınız bir nedenden dolayı gönderilememiştir. Daha sonra tekrar deneyerek ya da telefon numaramızı arayarak bizlere ulaşabilirsiniz. Bizi tercih ettiğiniz için teşekkür ederiz."
                })
            } else{
                res.send({
                    status: true,
                    message: "Sevgili müşterimiz " + nameRevised + ", mesajınız başarılı bir şekilde iletilmiştir. En kısa zamanda sizlere ulaşacağız. Bizi tercih ettiğiniz için teşekkür ederiz."
                })
            }
        }) 
        
    });
    
})

router.get('/magaza', favoriteBlogsMiddleware, async (req, res) => {

    
    const products = await Products.find({})
    
    const page = await Pages.findOne({page: "magaza"})

    res.render('magaza-developing', { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: page.seoText, favoriteBlogs: req.favoriteBlogs, products: products })
    
})

/* magaza product refresh */
router.post('/magaza', async (req, res) => {

    let productDroneSeries = await req.body.productDroneSeries
    let productMinPrice = await req.body.productMinPrice
    let productMaxPrice = await req.body.productMaxPrice

    if(!productDroneSeries[0]){
        const droneSeries = await DroneSeries.find({})
        for (let i = 0; i < droneSeries.length; i++) {
            productDroneSeries[i] = await droneSeries[i].url
        }
    }

    if(!productMinPrice){
        productMinPrice = await 0
    }

    if(!productMaxPrice){
        productMaxPrice = await 999999
    }

    let products = await Products.find({productDroneSeries: {$in: productDroneSeries}, productCurrentPrice: {$gt: productMinPrice, $lt: productMaxPrice}})

    res.send({
         status: true,
         products: products
    })

})

router.post('/productAddCart', async (req, res)=>{

    const productId = await req.body.productId
    const product = await Products.findOne({_id:productId})

    res.send({
        status: true,
        product: product
    })

})

router.get('/magaza/:productUrl', favoriteBlogsMiddleware, async (req, res) => {

    let dynamicSeoText = await ''

    const productUrl = await req.params.productUrl

    const product = await Products.findOne({productUrl:productUrl})

    if(!product){res.redirect('/magaza')}

    const page = await Pages.findOne({page: "urun-detay"})

    if(product.productSeoText) {dynamicSeoText = product.productSeoText}
    if(!product.productSeoText) {dynamicSeoText = page.seoText}

    res.render(page.page, { title: product.pageTitle, description: product.pageDescription, keywords: product.pageKeywords, author: page.author, bodyClass: page.bodyClass, seoText: dynamicSeoText, favoriteBlogs: req.favoriteBlogs, product: product })

})

router.get('/blog', favoriteBlogsMiddleware, async (req, res) => {

    const page = await Pages.findOne({page: "blog"})
    const pageBlog = await PageBlog.findOne()
    const blogData = await Blogs.find({blogStatus: 1})
        
    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, blog: blogData, seoText: page.seoText, blogColumnType: pageBlog.blogColumnType, blogMobileType: pageBlog.blogMobileType, favoriteBlogs: req.favoriteBlogs }) 
        
})

router.get('/blog/:blogUrl', favoriteBlogsMiddleware, async (req, res) => {

    const blogUrl = await req.params.blogUrl

    const blog = await Blogs.findOne({url: blogUrl, blogGeneralStatus: 1})

    if (!blog) {
        res.redirect('/404')
    }

    const previousBlog = await Blogs.findOne({_id: {$lt: blog._id}, blogGeneralStatus: 1}).sort({_id: -1}).limit(1)
    const nextBlog = await Blogs.findOne({_id: {$gt: blog._id}, blogGeneralStatus: 1}).sort({_id: 1}).limit(1)
            
    const blogCreated = moment(blog.createdAt.getTime()).locale('tr').format('DD MMMM YYYY')
    let blogEdited = moment(blog.updatedAt.getTime()).locale('tr').format('DD MMMM YYYY')

    if(blogCreated == blogEdited) {
        blogEdited = 0
    }

    res.render('blog-post', { title: blog.title, description: blog.description, keywords: blog.keywords, author: blog.author, bodyClass: blog.bodyClass, blog: blog, seoText: blog.seoText, previousBlog: previousBlog, nextBlog: nextBlog, blogCreated: blogCreated, blogEdited: blogEdited, favoriteBlogs: req.favoriteBlogs })

        
})

router.get('/iletisim', favoriteBlogsMiddleware, async (req, res) => {

    const page = await Pages.findOne({page: "iletisim"})
    const favoriteBlogs = await Blogs.find({blogStatus: true}).sort({ _id : -1 }).limit(5)
    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: page.seoText, favoriteBlogs: req.favoriteBlogs })

})

/* send mail in iletisim page */
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