const Router = require('koa-router');
const brandController = require('../controllers/brand');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.post('/', authMiddleware(), brandController.createBrand);
router.put('/:id', authMiddleware(), brandController.updateBrand);
router.delete('/:id', authMiddleware(), brandController.deleteBrand);

module.exports = router;
