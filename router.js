const homeRouter = require('./routes/home')
const authRouter = require('./routes/auth')
const expenseRouter = require('./routes/expense')
const userRouter = require('./routes/user')

const { getUserStatus } = require('./controllers/auth')

module.exports = (app) => {
    app.use('/', homeRouter);
    app.use('/', authRouter);
    app.use('/', expenseRouter)
    app.use('/', userRouter)

    app.get('*', getUserStatus, (req, res) => {
        res.render('404', {
            title: 'Error',
            isLogged: req.isLogged,
            username: req.session.username
        })
    })
} 

