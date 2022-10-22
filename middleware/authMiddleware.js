const jwt = require("jsonwebtoken");
const User = require('../models/User')

const requireAuth = (req, res, next) => {
  //Middlewares
  const { jwt: token } = req.cookies;
  if (token) {
    const isValid = jwt.verify(token, process.env.TOKEN_SECRET);
    if (isValid) {
      next();
    }
  }
  res.redirect("/login");
};

const checkUser = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if(token){
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if(err){
        res.locals.user = null;
        next();
      }else{
        const user = await User.findById(decodedToken.user);
        res.locals.user = user;
        next();
      }
    })
  }else{
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };
