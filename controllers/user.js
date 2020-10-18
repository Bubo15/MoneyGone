const { userErrorHandler } = require('../validation/user')
const { getExpenseById } = require('../controllers/expense')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const saveUser = async (req, res) => {
    const { passwordErrorMessage, rePasswordErrorMessage, usernameErrorMessage, amountErrorMessage } = userErrorHandler(req.body)

    if (passwordErrorMessage || usernameErrorMessage || amountErrorMessage || rePasswordErrorMessage) {
        return { passwordErrorMessage, usernameErrorMessage, amountErrorMessage, rePasswordErrorMessage }
    }

    const { username, password, amount } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ username, password: hashedPassword, amount: Number(amount) })

    try {
        const userObject = await user.save()

        const token = getToken({
            userID: userObject._id,
            username: userObject.username
        }, '1h')

        setSession(req, 'userID', userObject._id)
        setSession(req, 'username', username)

        setCookie(res, token, '1h', 'auth', true)

        return { message: "" }
    } catch (err) {
        if (err.code == 11000) {
            return { message: `Username ${err.keyValue.username} already exists` }
        }
        return { message: err }
    }
}

const verifyUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username });
        if (!user) { return false; }
        const status = await bcrypt.compare(password, user.password)

        if (status) {
            const token = getToken({
                userID: user._id,
                username: username
            }, '1h')

            setSession(req, 'userID', user._id)
            setSession(req, 'username', username)

            setCookie(res, token, '1h', 'auth', true)
        }

        return { isSuccessfullyLogged: status }
    } catch (err) {
        return { isSuccessfullyLogged: false }
    }
}

const operations = {
    '+': (amount, addtitionalAmount) => {
        const sum = Number(amount) + Number(addtitionalAmount)
        return sum
    },
    '-': (amount, addtitionalAmount) => {
        const sum = Number(amount) - Number(addtitionalAmount)
        return sum
    }
}

const updateUserAmount = async (id, additional, sign) => {
    const user = await User.findById(id);

    const update = {
        _id: user._id,
        username: user.username,
        password: user.password,
        amount: user.amount
    }

    update.amount = operations[sign](user.amount, additional)
    await User.findByIdAndUpdate(id, update)
}

const updateUserExpenses = async (userID, expenseID) => {
    await User.findByIdAndUpdate(userID, {
        $addToSet: {
            expenses: [expenseID]
        }
    });
}

const getUserById = async (id) => {
    const user = await User.findById(id).populate('expenses')
    return user;
}

const getUserTotalAmount = (expenses) => {
    let total = 0;
    expenses.map(async (expense) => {
        total += expense.total;
    });
    return total
}

const setCookie = (res, token, expire, name, httpOnly) => {
    res.cookie(name, token, {
        expire: expire,
        httpOnly: httpOnly
    })
}

const setSession = (req, key, value) => {
    req.session[key] = value;
}

const getToken = (data, expire) => {
    return jwt.sign(
        data,
        process.env.PRIVATE_KEY,
        { expiresIn: expire }
    );
}

module.exports = {
    saveUser,
    verifyUser,
    updateUserAmount,
    getUserById,
    updateUserExpenses,
    getUserTotalAmount
};