const { getUserById } = require('../controllers/user')

const errorHandler = {
    'merchant': (merchant) => {
        if (!merchant) {
            return 'Merchant is required'
        }
    },

    'total': (total, userAmount) => {
        if (!total) {
            return 'Total is required'
        } else if (Number(total) < 0) {
            return 'Total must be positive'
        } else if (Number(userAmount) - Number(total) < 0){
            return 'You have not enough money'
        }
    },

    'category': (category) => {
        if (!category) {
            return 'Category is required'
        }
    },

    'description': (description) => {
        if (!description) {
            return 'Description is required'
        } else if (description.length < 10 || description.length > 50) {
            return 'Description must be between 10 and 50 symbols'
        }
    }
}

const expenseErrorHandler = async (req) => {
    const { merchant, total, category, description } = req.body;
    const user = await getUserById(req.session.userID);

    const merchantErrorMessage = errorHandler['merchant'](merchant)
    const totalErrorMessage = errorHandler['total'](total, user.amount)
    const categoryErrorMessage = errorHandler['category'](category)
    const descriptionErrorMessage = errorHandler['description'](description)

    return {
        merchantErrorMessage,
        totalErrorMessage,
        categoryErrorMessage,
        descriptionErrorMessage
    }
}

module.exports = {
    expenseErrorHandler,
}