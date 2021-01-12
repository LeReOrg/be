import { Router } from 'express'; 
import models from '../models';
import User from '../models/user';
import Cart from '../models/cart'; 

const router = Router(); 

router.get('/', (req, res) => {
    User.find()
      .then(category => res.json(category))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  

// getCartByUserID()
router.get('/getCartByUserId/:userId', (req, res) => {
  Cart.find({owner_id: req.params["userId"]})
    .then(category => res.json(category))
    .catch(err => res.status(500).json('Error: ' + err));
});

export default router;