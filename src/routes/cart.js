import { Router } from 'express'; 
import models from '../models';
import Cart from '../models/cart'; 

const router = Router(); 

router.get('/', (req, res) => {
    Cart.find()
      .then(cart => res.status(200).json(cart))
      .catch(err => res.status(400).json('Error: ' + err));
});

// getProductsByCartID()
router.get('/getProductByCartId/:cartId', (req, res) => {
    Cart.find({id: req.params["cartId"]})
        .select({ product_details: 1 })
        .then(cart => res.status(200).json(cart))
        .catch(err => res.status(400).json('Error: ' + err));
});

// getCartByOwnerId/:OwnerId
router.get('/getCartByOwnerId/:OwnerId', (req, res) => {
    Cart.find({owner_id: req.params["OwnerId"]})
      .then(cart => res.status(200).json(cart))
      .catch(err => res.status(400).json('Error: ' + err));
});

export default router;