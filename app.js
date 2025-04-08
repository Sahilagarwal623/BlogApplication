require('dotenv').config()



const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const Blog = require('./models/blog');


const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');


const uri = process.env.MONGO_URL;

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
mongoose.connect(uri).then(() => console.log("connected to mongodb")).catch(err => console.log(err)
);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(checkForAuthenticationCookie("token"));
app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});    
    res.render('home', {
        user: JSON.stringify(req.user),
        blogs: allBlogs,
    });
});

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});

