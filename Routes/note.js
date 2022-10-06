const express = require('express')
var router = express.Router()
const Note = require('../Model/Notes')
const User = require('../Model/User')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')
const fetchUser = require('../middleware/fetchUser')

router.use(bodyParser.json()) // support parsing of application/json type post data
router.use(bodyParser.urlencoded({ extended: false })) // support parsing of application/x-www-form-urlencoded post data

router.get('/get-all-notes', fetchUser, async (req, res) => {
    try {
        const getAllNotes = await Note.find({ user_id: req.id }).populate('user_id', { name: 1, email: 1 })
        return res.status(200).json({
            message: "All Notes fetch successfully",
            success: 1,
            data: getAllNotes.length === 0 ? null : getAllNotes
        })
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.post('/add-notes', fetchUser, [
    body('title', 'Enter Valid Title.'),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ message: error.array(), success: 0, data: null })
        } else {
            const { title, description, tag } = req.body
            const user = await User.findById({ _id: req.id }).select('-password');
            const createNote = new Note({
                title, description, tag, user_id: user._id
            })
            await createNote.save();
            return res.status(200).json({
                message: "Note register successfully",
                success: 1,
                data: createNote
            })
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})


router.put('/update-note/:id', fetchUser, async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ message: error.array(), success: 0, data: null })
        } else {
            const { title, description, tag } = req.body
            const userId = req.id
            let newNote = {}
            if (title) { newNote.title = title }
            if (description) { newNote.description = description }
            if (tag) { newNote.tag = tag }
            let note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(400).json({
                    message: "Note is Not found our records.",
                    success: 0,
                })
            } else {
                if (note.user_id.toString() === userId) {
                    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
                    return res.status(400).json({
                        message: "Note updated successfully.",
                        success: 1,
                        data: note
                    })
                } else {
                    return res.status(400).json({
                        message: "User not authenticate.",
                        success: 0,
                    })
                }
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.delete('/delete-note/:id', fetchUser, async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ message: error.array(), success: 0, data: null })
        } else {
            const userId = req.id
            let note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(400).json({
                    message: "Note Not found.",
                    success: 0,
                })
            } else {
                if (note.user_id.toString() === userId) {
                    note = await Note.findByIdAndDelete(req.params.id)
                    return res.status(400).json({
                        message: "Note deleted successfully.",
                        success: 1
                    })
                } else {
                    return res.status(400).json({
                        message: "User not authenticate.",
                        success: 0,
                    })
                }
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router