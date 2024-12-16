const Router = require('koa-router');
const productController = require('../controllers/product');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', productController.getAllProducts);
router.get('/top-rated', productController.getTopRatedProducts);
router.get('/:id', productController.getProductById);
router.get('/product-by-type/:type', productController.getProductByType);
router.get('/related-product/:id', productController.getRelatedProducts);
router.post('/', authMiddleware(), productController.createProduct);
router.put('/:id', authMiddleware(), productController.updateProduct);
router.delete('/:id', authMiddleware(), productController.deleteProduct);

module.exports = router;
