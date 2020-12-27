import { Router } from 'express'; 
import models from '../models';
import Cart from '../models/cart'; 

const router = Router(); 

router.get('/', (req, res) => {
    Cart.find()
      .then(cart => res.json(cart))
      .catch(err => res.status(400).json('Error: ' + err));
});

// getProductsByCartID()
router.get('/getProductByCartId/:cartId', (req, res) => {
    let products = { 
        product_ids: [],
        quantities: []
    }
    for (let cart in models.carts) {
        if (models.carts[cart].id === req.params["cartId"]){
            products.product_ids = models.carts[cart].product_details.product_ids
            products.quantities = models.carts[cart].product_details.quantities
            break
        }
    }
    res.send(products);
});

// getCartByOwnerId()
router.get('/getCartByOwnerId/:OwnerId', (req, res) => {
    for (let cart in models.carts) {
        if (models.carts[cart].owner_id === req.params["OwnerId"]){
            res.send(models.carts[cart])
            break
        }
    }
});

export default router;