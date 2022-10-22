const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const handleError = (err) => {
    const errors = {
        email: '',
        password: ''
    }

    if (err.message === "incorrect email") {
        errors.email = "Email doesn't exist"
        return errors
    }

    if (err.message === "incorrect password") {
        errors.password = "Password is incorrect"
        return errors
    }

    if (err.code === 11000) {
        errors.email = "Email already exists"
    }

    if (err._message === "User validation failed") {
        Object.values(err.errors).map((error) => {
            const { properties } = error;
            errors[properties.path] = properties.message
        })
    }
    return errors
}

const returnSignupPage = (req, res) => {
    res.render('signup')
}

const returnLoginPage = (req, res) => {
    res.render('login')
}

const createUser = async (req, res) => {
    try {
        //Creates a user in database and returns the instance
        const user = await User.create(req.body)
        const token = jwt.sign({ user: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: '1d'
        })
        res.cookie('jwt', token);
        //Sending the id of new user to the frontend
        res.json({user : user._id})
    } catch (err) {
        const errors = handleError(err);
        res.json({errors})
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const passwordMatch = await bcrypt.compare(req.body.password, user.password)
            if (passwordMatch) {
                const token = jwt.sign({ user: user._id }, process.env.TOKEN_SECRET, {
                    expiresIn: '1d'
                })
                res.cookie('jwt', token);
                //Sending the id of new user to the frontend
                res.json({user : user._id})
            } else {
                throw new Error('incorrect password')
            }
        } else {
            throw new Error('incorrect email')
        }
    } catch (err) {
        const errors = handleError(err);
        res.json({errors})
    }
}

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/')
}

module.exports = {
    returnSignupPage,
    returnLoginPage,
    createUser,
    loginUser,
    logoutUser
}