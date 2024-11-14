const Coupon = require('../models/coupon');
const { validateCoupon } = require('../utils/validate');

exports.getAllCoupons = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.searchIndex = { $regex: ctx.query.keyword, $options: 'i' };
    }
    const coupons = await Coupon.find(query);
    ctx.body = coupons;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getCouponById = async ctx => {
  try {
    const coupon = await Coupon.findOne({ id: ctx.params.id });
    if (!coupon) {
      ctx.throw(404, 'Coupon not found');
    }
    ctx.body = coupon;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createCoupon = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateCoupon(data);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const hasCoupon = await Coupon.findOne({ id: data.id });
    if (hasCoupon) {
      ctx.throw(400, 'Coupon is already exists');
    }

    const newCoupon = new Coupon(data);
    if (!newCoupon.startTime) {
      newCoupon.startTime = new Date();
    }
    newCoupon._userId = ctx.state.user.id;
    const savedCoupon = await newCoupon.save();

    ctx.body = savedCoupon;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateCoupon = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateCoupon(data, true);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const updatedCoupon = await Coupon.findOneAndUpdate(
      { id: ctx.params.id },
      data,
      { new: true, userId: ctx.state.user.id },
    );
    if (!updatedCoupon) {
      ctx.throw(404, 'Coupon not found');
    }

    ctx.body = updatedCoupon;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteCoupon = async ctx => {
  try {
    const coupon = await Coupon.findOneAndDelete(
      {
        id: ctx.params.id,
      },
      { userId: ctx.state.user.id, id: ctx.params.id },
    );
    if (!coupon) {
      ctx.throw(404, 'Coupon not found');
    }

    ctx.body = coupon;
  } catch (err) {
    ctx.throw(500, err);
  }
};
