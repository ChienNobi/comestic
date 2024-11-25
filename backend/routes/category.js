const Router = require('koa-router');
const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/auth');
const {ROLES} = require("../commons/constants");

const router = new Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authMiddleware() ,categoryController.createCategory);
router.get(
  '/product-by-category/:type',
  categoryController.getProductByTypeCategory,
);
router.put('/:id', authMiddleware([ROLES.ADMIN]), categoryController.updateCategory);
router.delete('/:id', authMiddleware([ROLES.ADMIN]), categoryController.deleteCategory);

module.exports = router;
