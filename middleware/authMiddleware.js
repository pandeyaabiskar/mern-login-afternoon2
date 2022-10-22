const jwt = require("jsonwebtoken");

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

module.exports = { requireAuth };
