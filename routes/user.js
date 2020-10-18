const { Router } = require('express')
const router = Router();

const { updateUserAmount, getUserById, getUserTotalAmount } = require('../controllers/user')
const { isAuthenticated, getUserStatus } = require('../controllers/auth')

router.get('/profile', isAuthenticated, getUserStatus, async (req, res) => {
    const user = await getUserById(req.session.userID)
    const totalAmount = getUserTotalAmount(user.expenses);

    res.render('account-info', {
        title: 'Account | Info',
        isLogged: req.isLogged,
        username: req.session.username,
        availableAmount: user.amount,
        totalAmount: totalAmount,
        totalMerches: user.expenses.length
    })
})

router.post('/refill/amount', isAuthenticated, async (req, res) => {
    const newAmount = req.body.newAmount
    if (Number(newAmount) > 0) {
        await updateUserAmount(req.session.userID, req.body.newAmount, '+')
    }
    res.redirect('/')
})

module.exports = router;