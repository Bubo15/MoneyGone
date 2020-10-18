const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({  
    merchant: {
        type: String,
        required: [true, 'Merchant is required']
    },

    date: {
        type: Date,
        required: [true, 'Date is required']
    },

    total: {
        type: Number,
        required: [true, 'Total is required'],
        min: [0, 'Total must be positive']
    },

    category: {
        type: String,
        required: [true, 'Category is required']
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        min: [10, 'Description must has least 10 symbols'],
        max: [50, 'Description can not has more than 50 symbols']
    },

    report: {
        type: Boolean,
        required: [true, 'Report is required'],
        default: false
    },

    userID: {
        type: ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Expense', ExpenseSchema);
