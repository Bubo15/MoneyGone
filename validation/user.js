const errorHandler = {
    'password': (password) => {
        if (!password) {
            return 'Password is required'
        } else if (password.length < 8) {
            return 'Password must has least 8 symbols'
        } else if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
            return 'Password must has digits and characters'
        }
    },

    'username': (username) => {
        if (!username) {
            return 'Username is required'
        }
    },

    'amount': (amount) => {
        if (!amount) {
            return 'Amount is required'
        } else if (Number(amount) < 0) {
            return 'Amount must be positive'
        }
    },

    'rePassword': (pass, rePass) => {
        if (!rePass) {
            return 'Repeat Password is required'
        } else if (JSON.stringify(pass) !== JSON.stringify(rePass)) {
            return 'Passwords does not match'
        }
    }
}

const userErrorHandler = (body) => {
    const { username, password, repeatPassword, amount } = body;

    const passwordErrorMessage = errorHandler['password'](password)
    const usernameErrorMessage = errorHandler['username'](username)
    const amountErrorMessage = errorHandler['amount'](amount)
    const rePasswordErrorMessage = errorHandler['rePassword'](password, repeatPassword)

    return {
        passwordErrorMessage,
        usernameErrorMessage,
        amountErrorMessage,
        rePasswordErrorMessage
    }
}

module.exports = {
    userErrorHandler
}