import { Router } from 'express'; 
import models from '../models';
import User from '../models/user';
import Cart from '../models/cart';
import sendEmail from "../send-email";

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

router.post('/validateToken', (req, res) => {
  if (req.body.token === TOKEN) {
    res.status(200).json({'Message': 'Ok'})
  } else {
    res.status(500).json({'Error': 'Token not match'})
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
        }
      })
      .then((user) => {
        res.status(200).json({status: 'Registration Successful!', user: user})
      })
    }
  })
  .catch(err => res.status(400).json('Error: ' + err));
})

// getCartByUserID()
router.get('/getCartByUserId/:userId', (req, res) => {
  Cart.find({owner_id: req.params["userId"]})
    .then(category => res.json(category))
    .catch(err => res.status(500).json('Error: ' + err));
});

export default router;