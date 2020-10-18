const { Router } = require('express')
const router = Router();

const { getUserStatus, guestAccess } = require('../controllers/auth')
const { saveUser, verifyUser } = require('../controllers/user')

router.get('/register', guestAccess, getUserStatus, async (req, res) => {
    res.render('register', {
        title: 'Register',
        isLogged: req.isLogged
    })
})

router.post('/register', guestAccess, async (req, res) => {
    const { passwordErrorMessage, usernameErrorMessage, amountErrorMessage, rePasswordErrorMessage, message } = await saveUser(req, res);
    const isThereError = passwordErrorMessage || usernameErrorMessage || amountErrorMessage || rePasswordErrorMessage || message;

    if (isThereError) {
        return res.render('register', {
            username: req.body.username,
            amount: req.body.amount,
            errorPass: passwordErrorMessage,
            errorUsername: usernameErrorMessage,
            errorAmount: amountErrorMessage,
            errorRePass: rePasswordErrorMessage,
            error: message,
            isLogged: false
        })
    }
    return res.redirect('/')
})

router.get('/login', guestAccess, getUserStatus, async (req, res) => {
    res.render('login', {
        title: 'Login',
        isLogged: req.isLogged
    })
})

router.post('/login', guestAccess, async (req, res) => {
    const { isSuccessfullyLogged } = await verifyUser(req, res);

    if (isSuccessfullyLogged) { return res.redirect('/') }

    return res.render('login', {
        username: req.body.username,
        errorMessage: 'Username or password is wrong',
        isLogged: false
    })
})

router.get('/logout', async (__, res) => {
    res.clearCookie('auth');
    res.redirect('/')
})

module.exports = router;