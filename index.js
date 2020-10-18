require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

// DB Connection
mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) { console.log(err) }
    console.log('Successfuly connected to DB')
})

// Set Configa
require('./config/express')(app)

// Use session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));

// Set Routers
require('./router')(app)

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}! Now its up to you...`));