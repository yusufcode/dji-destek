const express = require('express')
const router = express.Router()

const PagesAdmin = require('../models/PagesAdmin')

const DroneSeries = require('../models/DroneSeries')
const DroneModels = require('../models/DroneModels')
const DroneAltModels = require('../models/DroneAltModels')

const PageBlog = require('../models/PageBlog')
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

router.get('/teknik-servis', (req, res) => {
    
    PagesAdmin.findOne({page: 'admin/technic-service'}, (err,page) => {
        DroneSeries.find({ }, (err, droneSeries) => {
            DroneModels.find({ }, (err, droneModels) => {
                DroneAltModels.find({ }, (err, droneAltModels) => {
                    res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass, droneSeries: droneSeries, droneModels: droneModels, droneAltModels: droneAltModels})
                })
            })
        })
    })

})

router.get('/teknik-servis-drone-duzenle/:droneId', (req, res) => {

    const droneId = req.params.droneId
    let selectedDrone
    
    PagesAdmin.findOne({page: 'admin/technic-service-drone-edit'}, (err,page) => {
        DroneSeries.findOne({_id:droneId}, (err, droneSeries) => {
            
            if(droneSeries){
                selectedDrone = droneSeries
            } 

            DroneModels.findOne({_id:droneId}, (err, droneModels) => {
                
                if(droneModels){
                    selectedDrone = droneModels
                }
                
                DroneAltModels.findOne({_id:droneId}, (err, droneAltModels) => {
                    
                    if(droneAltModels){
                        selectedDrone = droneAltModels
                    } 
                    
                    res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass, drone: selectedDrone})
                    
                })
                
            })

        })
    })

})

router.post('/teknik-servis-drone-duzenle', (req, res) => {

    if(req.body.altModel){
        DroneAltModels.updateOne(
            {
                _id: req.body._id
            },
            {
                name: req.body.name,
                seoText: req.body.seoText
            },
            (err,data) => {
                if(data.n == 1){
                    res.send({
                        status: true,
                        message: 'Drone güncellendi'
                    })
                }
                else {
                    res.send({
                        status: false,
                        message: 'Drone güncellenemedi'
                    })
                }
            })
    } else if (req.body.model) {
        DroneModels.updateOne(
            {
                _id: req.body._id
            },
            {
                name: req.body.name,
                seoText: req.body.seoText
            },
            (err,data) => {
                if(data.n == 1){
                    res.send({
                        status: true,
                        message: 'Drone güncellendi'
                    })
                }
                else {
                    res.send({
                        status: false,
                        message: 'Drone güncellenemedi'
                    })
                }
            })
    } else {
        DroneSeries.updateOne(
            {
                _id: req.body._id
            },
            {
                name: req.body.name,
                seoText: req.body.seoText
            },
            (err,data) => {
                if(data.n == 1){
                    res.send({
                        status: true,
                        message: 'Drone güncellendi'
                    })
                }
                else {
                    res.send({
                        status: false,
                        message: 'Drone güncellenemedi'
                    })
                }
            })
    }

    

})

router.get('/blog', (req, res) => {
    
    PagesAdmin.findOne({page: 'admin/blog'}, (err,page) => {
        PageBlog.findOne({ }, (err,pageBlog) => {
            Blogs.find((err, blogFind) => {
                res.render(page.page, {title: page.title, pageName: page.pageName, layout: page.layout, bodyClass: page.bodyClass, blog: blogFind, pageBlog: pageBlog})
            })
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

router.post('/blog-sayfasi-duzenle/', (req, res) => {

    PageBlog.updateOne(
        { },
        {
            blogColumnType: req.body.blogColumnType,
            blogMobileType: req.body.blogMobileType
        },
        (err,data) => {
            if(data.n == 1){
                res.send({
                    status: true,
                    message: "Blog sayfası ayarları güncellendi."
                })
            }
            else {
                res.send({
                    status: false,
                    message: "Blog sayfası ayarları güncellendi."
                })
            }
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
            blogStatus: req.body.blogStatus,
            blogGeneralStatus: req.body.blogGeneralStatus
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

router.post('/blog-genel-durum/:blogId', (req, res) => {

    const blogId = req.params.blogId

    Blogs.findById(blogId, (err,data) => {

        if(data.blogGeneralStatus) {
            Blogs.findByIdAndUpdate(
                blogId, 
                {
                    blogGeneralStatus: false
                },
                (err,data) => {
                    if(data) {res.send('falsed')}
                }
            )
        } else {
            Blogs.findByIdAndUpdate(
                blogId, 
                {
                    blogGeneralStatus: true
                },
                (err,data) => {
                    if(data) {res.send('trued')}
                }
            )
        }

        
    })

})

module.exports = router;