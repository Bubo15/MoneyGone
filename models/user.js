const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        min: [8, 'Password must be leaast 8 symbols'],
    },

    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        default: 0,
        min: [0, 'Amount must be positive']
    },

    expenses: [{
        type: ObjectId,
        ref: 'Expense'
    }]
})

module.exports = mongoose.model('User', UserSchema);