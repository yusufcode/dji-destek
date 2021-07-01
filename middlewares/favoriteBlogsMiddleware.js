const Blogs = require('../models/Blogs')

module.exports = async (req,res,next) => {

    const favoriteBlogs = await Blogs.find({blogStatus: true}).sort({ _id : -1 }).limit(5)

    req.favoriteBlogs = await favoriteBlogs

    next()

}