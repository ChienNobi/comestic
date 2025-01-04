const Router = require('koa-router');
const orderController = require('../controllers/order');
const authMiddleware = require("../middleware/auth");
const router = new Router();

router.get('/:id', orderController.getOrder);
router.get('/orders-by-user/:id', orderController.getOrdersByUser);
router.get('/', orderController.getAllOrders);
router.post('/add', orderController.createOrder);
router.post('/create-payment-intent', authMiddleware(), orderController.paymentIntent);
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;
