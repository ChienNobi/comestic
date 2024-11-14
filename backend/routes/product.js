const Router = require('koa-router');
const productController = require('../controllers/product');

const router = new Router();

router.get('/', productController.getAllProducts);
router.get('/top-rated', productController.getTopRatedProducts);
router.get('/:id', productController.getProductById);
router.get('/product-by-type/:type', productController.getProductByType);
router.get('/related-product/:id', productController.getRelatedProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
