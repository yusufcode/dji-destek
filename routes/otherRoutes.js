const express = require('express')
const router = express.Router()
const fs = require("fs");

const Pages = require('../models/Pages')
const Blogs = require('../models/Blogs')


router.get('/404', async (req, res) => {

    const page = await Pages.findOne({page: "404"})
    const favoriteBlogs = await Blogs.find({blogStatus: true}).sort({ _id : -1 }).limit(5)
    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, seoText: '', favoriteBlogs: favoriteBlogs})
    
})

router.get('/admin/404', async (req, res) => {
    
    const page = await Pages.findOne({page: "404"})
    res.render(page.page, { title: page.title, description: page.description, keywords: page.keywords, author: page.author, bodyClass: page.bodyClass, layout: 'layouts/layout-admin', pageName: '404' })
    
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

router.get('/admin/*', (req, res) => {
    res.redirect('/admin/404')
})

router.get('*', (req, res) => {
    res.redirect('/404')
})

module.exports = router;