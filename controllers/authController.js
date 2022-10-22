const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    const errors = {
        email: '',
        password: ''
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

const loginUser = (req, res) => {
    //Code
}

const logoutUser = (req, res) => {
    
}

module.exports = {
    returnSignupPage,
    returnLoginPage,
    createUser,
    loginUser,
    logoutUser
}