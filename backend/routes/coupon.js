const Router = require('koa-router');
const couponController = require('../controllers/coupon');
const authMiddleware = require("../middleware/auth");
const {ROLES} = require("../commons/constants");

const router = new Router();

router.get('/', couponController.getAllCoupons);
router.get('/:id', couponController.getCouponById);
router.post('/', authMiddleware(), couponController.createCoupon);
router.put('/:id', authMiddleware(), couponController.updateCoupon);
router.delete('/:id', authMiddleware(), couponController.deleteCoupon);

module.exports = router;
