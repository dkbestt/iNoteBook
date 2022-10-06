const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
})

let User = mongoose.model('user', userSchema)

module.exports = User;