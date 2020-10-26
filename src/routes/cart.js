import { Router } from 'express'; 
import models from '../models';

const router = Router(); 

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