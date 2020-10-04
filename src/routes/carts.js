import { Router } from 'express'; 
import models from '../models';

const router = Router(); 

// getProductsByCartID()
router.get('/:cartId', (req, res) => {
    let products = { 
        ids: [],
        quantities: []
    }
    for (let cart in models.carts) {
        if (models.carts[cart].id === req.params["cartId"]){
            products.ids = models.carts[cart].product_details.product_ids
            products.quantities = models.carts[cart].product_details.quantities
            break
        }
    }
    res.send(products);
});

export default router;