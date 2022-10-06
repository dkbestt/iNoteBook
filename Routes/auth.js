const express = require('express')
var router = express.Router()
const User = require('../Model/User')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const SECRET_KEY = "inotebookproject"
const fetchUser = require('../middleware/fetchUser')


router.use(bodyParser.json()) // support parsing of application/json type post data
router.use(bodyParser.urlencoded({ extended: false })) // support parsing of application/x-www-form-urlencoded post data

//  register user 
router.post('/register', [
    body('name', 'Enter Valid name.').isLength({ min: 3 }),
    body('password', 'Enter Valid password.').isLength({ min: 6 }),
    body('email', 'Enter Valid Email.').isEmail(),
], async function (req, res) {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ message: error.array(), success: 0, data: null })
        } else {
            const email_check = await User.findOne({ email: req.body.email })
            if (email_check) {
                return res.status(400).json({ message: "email already register", success: 0 })
            }
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const registerUser = new User({
                name: req.body.name,
                password: hashPassword,
                email: req.body.email
            })
            await registerUser.save()
            const token = jwt.sign({ id: registerUser._id }, SECRET_KEY)
            return res.status(200).json({
                message: "User register Successfully.",
                success: 1,
                data: { registerUser, token }
            })
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})

// login user
router.post('/login', [
    body('email', 'Enter Valid Email.').isEmail(),
    body('password', 'Enter Valid password.').isLength({ min: 6 }).exists(),
], async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ message: error.array(), success: 0, data: null })
        }
        if (req.body.email == null || req.body.password == null) {
            return res.status(400).json({ message: "All fields are required.", success: 0 })
        } else {
            const user = await User.findOne({ email: req.body.email })
            if (user === null) {
                return res.status(400).json({ message: "Please try to login with correct credentials.", success: 0 })
            }
            const is_match_password = await bcrypt.compare(req.body.password, user.password)
            if (!is_match_password) {
                return res.status(400).json({ message: "Please try to login with correct credentials.", success: 0 })
            }
            const token = jwt.sign({ id: user._id }, SECRET_KEY)
            return res.status(200).json({
                message: "User login Successfully.",
                success: 1,
                data: { user, token }
            })
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})

// get login user
router.post('/get-user', fetchUser, async (req, res) => {
    try {
        const userID = req.id
        const user = await User.findById({ _id: userID }).select('-password') // both same
        // const user = await User.findById(userID).select('-password') // both same
        if (user !== null) {
            return res.status(200).json({
                message: "User fetch Successfully.",
                success: 1,
                data: user
            })
        } else {
            return res.status(400).json({
                message: "Something went wrong",
                success: 0,
                data: null
            })
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})

module.exports = router