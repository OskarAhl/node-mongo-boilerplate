const { User } = require('./../models/users');

// middleware function to make routes private
// actual route won't run until next() gets called in middleware
const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.findByToken(token).then((user) => {
      if (!user) {
        // sends 401
        return Promise.reject();
      }
      // authenticated: 
      // => can access user and token in route   
      req.user = user;
      req.token = token;  
      next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = { authenticate };