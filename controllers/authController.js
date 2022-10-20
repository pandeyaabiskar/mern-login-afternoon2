const User = require('../models/User');

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
        //Sending the id of new user to the frontend
        res.json({user : user._id})
    } catch (err) {
        console.log(err)
        res.json({errors : "Error occured"})
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