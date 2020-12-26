import { Router } from 'express'; 
import models from '../models';
import Category from '../models/category';

const router = Router(); 

router.get('/', (req, res) => {
  Category.find()
    .then(category => res.json(category))
    .catch(err => res.status(400).json('Error: ' + err));
});

// getCategory
router.get('/getCategory', (req, res) => {
    res.send(models.categories);
});

	
router.post('/', (req,res) => {
    const id = req.body.id;
    const name = req.body.name;
    const image_url = req.body.image_url;

    const newCategory = new Category({
      id,
      name,
      image_url
    });

    newCategory.save()
			.then(() => res.json('Category added!'))
			.catch(err => res.status(400).json('Error: ' + err));
});

export default router;