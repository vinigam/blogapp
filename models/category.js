const mongoose = require('mongoose')

const Schema = mongoose.Schema

const category = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

mongoose.model('category', category)