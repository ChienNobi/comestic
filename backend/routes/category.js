const Router = require('koa-router');
const categoryController = require('../controllers/category');

const router = new Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.get(
  '/product-by-category/:type',
  categoryController.getProductByTypeCategory,
);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
