const User = require('../models/user');
// const async = require('async');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const { body, validationResult } = require("express-validator");

//I will probably have to do better at breaking down long functions


/*
  1. Change Login api endpoint to have the validation and test it
  2. Look up the purpose of using next and error handling (might be in fullstackopen)
  3. Create and test typingTest endpoints 
      --I think we will send data to the server for each test completion and will do data analysis, 
        but will only save data if the user is authenticated
  
  What's next?
  1. data analysis and reporting? (when the user posts a new typingTest, some interperted data will be expected in the response)
  2. register and login on the front end?
  3. improve test results view on the front end
  4. user profile/dashboard? (here I have to decide what statistics I should show, and this may influence how I store data in the database)
  5. tests for backend and refactoring
  6. write "About" page text and work on landing page with "About" text in short test

*/

const register = [
  body('username', 'Username required').trim().isLength({min: 1}).escape(),
  body('password', 'Password required').trim().isLength({min: 1}).escape(),
  body('password_confirmed', 'Password required').trim().isLength({min: 1}).escape(),

  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      res.json(errors);
    }else{
      const user = await User.findOne({username: req.body.username});

      if(user !== null){
        throw new Error("Username Taken");
      }else if(req.body.password !== req.body.password_confirmed){
        throw new Error("Passwords Differ");
      }else{
        const user = await saveUser(req.body.username, req.body.password);
        res.json(user);
      }
    }
  }
]

const saveUser = async (username, password) => {
  password = await bcrypt.hash(password, 10);

  let user = await new User({ username, password }).save();

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: '1hr' });
  return { username: user.username,  token};
}

const login = [
  body('username', 'Username required').trim().isLength({min: 1}).escape(),
  body('password', 'Password required').trim().isLength({min: 1}).escape(),

   async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      res.json(errors);
    }else{

      const user = await User.findOne({ username: req.body.username });
      
      if(user !== null){
        const match = await bcrypt.compare(req.body.password, user.password);

        if(match){
          const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: '1s' });
          res.json({ username: user.username, token });
        }else{
          throw new Error("Invalid Credentials");
        }
      }else{
        throw new Error("Invalid Credentials");
      }
    }
  }
]

const validate = (req, res) => {
  // verifyToken(req);
  const token = req.headers['x-access-token'];

  if(token){
    let authData = jwt.verify(req.token, process.env.TOKEN_SECRET);
  
    if(authData){
      res.sendStatus(200);
    }else{
      res.sendStatus(403);
    }
  }else{
    res.sendStatus(403);
  }
}

// const verifyToken = (req) => {
//   const token = req.headers['x-access-token'];

//   if(token){
//     req.token = token;
//   }else{
//     res.sendStatus(403);
//   }
// }

module.exports = {
  register,
  login,
  validate,
}