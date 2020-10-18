const { Router } = require('express')
const router = Router();

const { getUserStatus } = require('../controllers/auth')
const { getAllExpenses, getExpenseById } = require('../controllers/expense')

router.get('/', getUserStatus, async (req, res) => {
    res.render('home', {
        title: 'Home',
        isLogged: req.isLogged,
        username: req.session.username,
        expenses: await getAllExpenses()
    })
})

router.get('/report/:expenseID', getUserStatus, async (req, res) => {
    const expenseID = req.params.expenseID;
    const expense = await getExpenseById(expenseID)

    res.render('report', {
        title: 'Report',
        isLogged: req.isLogged,
        username: req.session.username,
        id: expense._id,
        date: expense.date,
        total: expense.total,
        merchant: expense.merchant,
        description: expense.description,
    })
})

module.exports = router;