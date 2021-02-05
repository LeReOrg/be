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

// getCartByUserID()
router.get('/getCartByUserId/:userId', (req, res) => {
  Cart.find({owner_id: req.params["userId"]})
    .then(category => res.json(category))
    .catch(err => res.status(500).json('Error: ' + err));
});

export default router;