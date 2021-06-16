const express = require('express')
const router = express.Router()

const PagesAdmin = require('../models/PagesAdmin')
const Blogs = require('../models/Blogs')
const Users = require('../models/Users')

router.get('/', (req, res) => {

    /*const newPage = new PagesAdmin({
        page: "admin/blog",
        title: "Blog - Admin | DJI Destek",
        layout: "layouts/layout-admin"
    })

    newPage.save((err,data) => {
        if(err) {console.log(err)}
        else {console.log(data)}
    })*/

    PagesAdmin.findOne({page: 'admin/index'}, (err,page) => {
        res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass})
    })

})

router.get('/blog', (req, res) => {
    
    PagesAdmin.findOne({page: 'admin/blog'}, (err,page) => {
        Blogs.find((err, blogFind) => {
         res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass, blog: blogFind})
        })
    })

})

router.get('/blog-duzenle/:blogId', (req, res) => {

    const blogId = req.params.blogId
    
    PagesAdmin.findOne({page: 'admin/blog-edit'}, (err,page) => {
        Blogs.findOne({_id: blogId}, (err, blogFind) => {
            res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass, blog: blogFind})
        })
    })

})

router.post('/blog-duzenle/', (req, res) => {

    Blogs.updateOne(
        {
            _id: req.body._id
        },
        {
            url: req.body.url,
            title: req.body.title,
            description: req.body.description,
            keywords: req.body.keywords,
            author: req.body.author,
            blogTitle: req.body.blogTitle,
            blogText: req.body.blogText,
            blogImage: req.body.blogImage,
            blogStatus: req.body.blogStatus
        },
        (err,data) => {
            if(data.n == 1){
                res.send('success')
            }
            else {
                res.send('false')
            }
        })

})

router.get('/blog-ekle', (req, res) => {
    
    PagesAdmin.findOne({page: 'admin/blog-add'}, (err,page) => {
        res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass})
    })

})

router.post('/blog-ekle', (req, res) => {

    const newBlog = new Blogs(req.body)

    newBlog.save((err,data) => {
        if(err){console.log(err)}
        else{
            res.sendStatus(200)
        }
    })

})

router.post('/blog-sil/:blogId', (req, res) => {

    const blogId = req.params.blogId

    Blogs.findByIdAndRemove(blogId, (err,data) => {
        if(err){console.log(err)}
        else{
            res.sendStatus(200)
        }
    })

})

router.post('/blog-durum/:blogId', (req, res) => {

    const blogId = req.params.blogId

    Blogs.findById(blogId, (err,data) => {

        if(data.blogStatus) {
            Blogs.findByIdAndUpdate(
                blogId, 
                {
                    blogStatus: false
                },
                (err,data) => {
                    if(data) {res.send('falsed')}
                }
            )
        } else {
            Blogs.findByIdAndUpdate(
                blogId, 
                {
                    blogStatus: true
                },
                (err,data) => {
                    if(data) {res.send('trued')}
                }
            )
        }

        
    })

})

module.exports = router;