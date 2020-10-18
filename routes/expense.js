const { Router } = require('express')
const router = Router();

const { isAuthenticated, getUserStatus } = require('../controllers/auth')
const { createExpense, deleteExpenseById } = require('../controllers/expense')

router.get('/expense/add', isAuthenticated, getUserStatus, (req, res) => {
    res.render('new-expense', {
        title: 'Create | Expense',
        isLogged: req.isLogged,
        username: req.session.username
    })
})

router.post('/expense/add', isAuthenticated, async (req, res) => {

    const { merchantErrorMessage, totalErrorMessage, categoryErrorMessage, descriptionErrorMessage, message } = await createExpense(req, res);

    if (merchantErrorMessage || totalErrorMessage || categoryErrorMessage || descriptionErrorMessage || message) {
        const errors = {
            merchantErrMessage: merchantErrorMessage,
            totalErrMessage: totalErrorMessage,
            categoryErrMessage: categoryErrorMessage,
            descriptionErrMessage: descriptionErrorMessage,
        }
        return res.render('new-expense', {
            title: 'Create | Expense',
            isLogged: true,
            errors: errors,
            error: message,
            data: req.body,
            username: req.session.username
        })
    }

    return res.redirect('/')
})

router.get('/expense/tracking/:expenseID', isAuthenticated, async (req, res) => {
    const expenseID = req.params.expenseID
    const isDeleted = await deleteExpenseById(expenseID)

    if(isDeleted){
        return res.redirect('/')
    }

    return res.status(404);
})

module.exports = router;