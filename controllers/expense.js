const Expense = require('../models/expense')
const { updateUserAmount, updateUserExpenses } = require('../controllers/user')

const { expenseErrorHandler } = require('../validation/expense')
var dateFormat = require('dateformat');


const createExpense = async (req, res) => {
    const { merchantErrorMessage, totalErrorMessage, categoryErrorMessage, descriptionErrorMessage } = await expenseErrorHandler(req)

    if (merchantErrorMessage || totalErrorMessage || categoryErrorMessage || descriptionErrorMessage) {
        return { merchantErrorMessage, totalErrorMessage, categoryErrorMessage, descriptionErrorMessage }
    }

    const { merchant, total, category, description, report } = req.body
    const expense = new Expense({
        merchant,
        date: dateFormat(new Date(), "yyyy-mm-dd"),
        total,
        category,
        description,
        report: report ? Boolean(report) : false,
        userID: req.session.userID
    })

    try {
        await expense.save()
        updateUserExpenses(req.session.userID, expense._id)
        updateUserAmount(req.session.userID, total, '-')
        return { message: "" }
    } catch (err) {
        return { message: err }
    }
}

const getAllExpenses = async () => {
    const expenses = await Expense.find().lean()
    return expenses
}

const getExpenseById = async (id) => {
    const expense = await Expense.findById(id);
    return expense
}

const deleteExpenseById = async (id) => {
    const isDeleted = await Expense.findByIdAndDelete(id);
    return isDeleted
}

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    deleteExpenseById
}