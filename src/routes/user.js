import { Router } from 'express'; 
import models from '../models';
import User from '../models/user';

const router = Router(); 

router.get('/', (req, res) => {
    User.find()
      .then(category => res.json(category))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  

// getCartByUserID()
router.get('/getCartByUserId/:userId', (req, res) => {
    let cart = models.carts.filter(cart => cart.owner_id === req.params["userId"]); 
    res.send(cart);
});

export default router;