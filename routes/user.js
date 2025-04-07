const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
    if (req.user) res.redirect('/');
    return res.render('signin')
})

router.post('/signin', async (req, res) => {

    const { email, password } = req.body;

    try {

        const token = await User.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token).redirect('/');

    } catch (error) {
        res.render('signin', {
            error: error.message,
        });
    }

})


router.get('/signup', (req, res) => {
    if (req.user) res.redirect('/');
    return res.render('signup')
})
router.post('/signup', async (req, res) => {

    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.render('signup', {
            error: "confirm password does not match"
        });
        return;
    }
    try {
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect('/user/signin');
    } catch (error) {        
        res.render('signup', {
            error: "Bad credentials!"
        });
    }
});

router.get('/logout', (req, res, next) => {
    res.clearCookie('token').redirect('/');
})



module.exports = router;