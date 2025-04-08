const { Router } = require('express');
const router = Router();
const path = require('path');
const fs = require('fs')
const multer = require('multer');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { uploadImage } = require('../services/upload');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {

    return res.render('addBlog', {
        user: JSON.stringify(req.user),
    })
})

router.post('/', upload.single('coverImage'), async (req, res) => {

    const cloud_image_url = await uploadImage(req.file ? `/uploads/${req.file.filename}` : '/images/cardImage.png');

    if (req.file) {
        const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
        console.log(filePath);
        
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete file:', err);
            else console.log('File deleted successfully');
        });
    }
    const { title, about } = req.body;
    const blog = await Blog.create({
        title,
        body: about,
        createdBy: req.user._id,
        coverImageURL: cloud_image_url,
    });
    // console.log(blog);

    res.redirect('/');
})

router.post('/comment/:blogId', async (req, res) => {

    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`);
})

router.get('/:id', async (req, res) => {

    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');

    // console.log(blog);

    return res.render('blog', {
        user: JSON.stringify(req.user),
        blog,
        comments,
    })
})

router.post('/deleteBlog/:id', async (req, res) => {

    const response = await Blog.deleteOne({ _id: req.params.id });
    // console.log(response);
    res.redirect('/');
})

module.exports = router;