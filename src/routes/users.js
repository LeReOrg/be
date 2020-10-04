import { Router } from 'express'; 
import models from '../models';

const router = Router(); 

// getCartByUserID()
router.get('/:userId', (req, res) => {
    let cart = models.carts.filter(cart => cart.id === req.params["userId"]); 
    res.send(cart);
});

export default router;