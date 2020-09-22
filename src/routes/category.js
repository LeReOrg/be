import { Router } from 'express'; 
import models from './../models';

const router = Router(); 

// getCategory()
router.get('/', (req, res) => {
    res.send(models.categories);
});

export default router;