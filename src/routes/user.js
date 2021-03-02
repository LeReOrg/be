import { Router } from 'express'; 
import models from '../models';
import User from '../models/user';
import Cart from '../models/cart';
import sendEmail from "../send-email";
import Product from "../models/product";

const router = Router();
const TOKEN = "a7sh2jd92hzf"

router.get('/', (req, res) => {
    User.find()
      .then(category => res.json(category))
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.post('/resetPassword', (req, res) => {
  res.status(200).json({token: TOKEN})
});

// validateToken()
router.post('/validateToken', (req, res) => {
  if (req.body.token === TOKEN) {
    res.status(200).json({'Message': 'Ok'})
  } else {
    res.status(400).json({'Error': 'Token not match'})
  }
});

// signup
router.post('/signup', (req, res) => { 

  User.findOne({'authentication.username': req.body.username})
  .then((user) => {
    if(user != null) {
      res.status(403).json({'Error': 'User already exists'})
    }
    else {
      User.create({
        authentication: {
          username: req.body.username,
          password: req.body.password
        },
        full_name: req.body.full_name,
        mobile: req.body.mobile,
        email: req.body.email,
      })
      .then((user) => {
        res.status(200).json({status: 'Registration Successful!', user: user})
      })
    }
  })
  .catch(err => res.status(400).json('Error: ' + err));
})

// changePassword()
router.post('/changePassword', (req, res) => {
  let username = req.body.username
  let new_password = req.body.new_password

  User.findOne({'authentication.username': username})
    .then((user) => {
      if(user != null) {
        res.status(403).json({'Error': 'User already exists'})
        user.password = new_password
        user.save()
          .then(() => res.status(200).json({'Message': 'Ok'}))
          .catch(err => res.status(400).json('Error: ' + err));
      }
      else {
        res.status(200).json({'Message': 'User not found'})
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// login()
router.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  User.findOne({
    'authentication.username': username,
    'authentication.password': password,
  })
    .then((user) => {
      if(user != null) {
        res.status(200).json({'Message': 'Ok'})
      }
      else {
        res.status(200).json({'Message': 'User not found'})
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// loginFirebase()
router.post('/loginFirebase', (req, res) => {
  let inputToken = req.body.token;

  User.find({firebase_token: inputToken})
    .then(user => {
        if (user.length) {
          res.status(200).json({'Message': 'Ok'});
        } else {
          res.status(400).json({'Error': 'Invalid user'})
        }
      }
      )
    .catch(err => res.status(500).json('Error: ' + err))
});

// getCartByUserID()
router.get('/getCartByUserId/:userId', (req, res) => {
  Cart.find({owner_id: req.params["userId"]})
    .then(category => res.json(category))
    .catch(err => res.status(500).json('Error: ' + err));
});

export default router;