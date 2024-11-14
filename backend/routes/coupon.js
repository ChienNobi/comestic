const Router = require('koa-router');
const couponController = require('../controllers/coupon');

const router = new Router();

router.get('/', couponController.getAllCoupons);
router.get('/:id', couponController.getCouponById);
router.post('/', couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
