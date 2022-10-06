const mongoose = require('mongoose')

var noteSchema = mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String, required: true
    },
    tag: {
        type: String, default: 'general'
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
})

let Note = mongoose.model('note', noteSchema)

module.exports = Note;