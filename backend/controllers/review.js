const User = require('../models/user');
const Products = require('../models/product');
const Reviews = require('../models/review');
const { v4: uuidv4 } = require('uuid');

exports.createReview = async ctx => {
  try {
    const data = ctx.request.body;
    const { userId, productId, rating, comment } = data;

    const hasReview = await Reviews.findOne({ userId, productId });
    if (hasReview) {
      ctx.throw(400, 'You have already left a review for this product.');
    }

    const user = await User.findById(userId).select('name imageURL');
    if (!user) {
      ctx.throw(404, 'User not found.');
    }

    const review = await Reviews.create({
      id: uuidv4(),
      userId,
      productId,
      rating,
      comment,
    });

    const product = await Products.findOne({ id: productId });
    if (!product) {
      ctx.throw(404, 'Product not found.');
    }

    // Kiểm tra và khởi tạo mảng reviews nếu chưa tồn tại
    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }
    product.reviews.push(review._id);
    await product.save();

    // Kiểm tra và khởi tạo mảng reviews của user nếu chưa tồn tại
    if (!Array.isArray(user.reviews)) {
      user.reviews = [];
    }
    user.reviews.push(review._id);
    await user.save();

    // Trả về Review đã tạo
    ctx.body = review;
  } catch (err) {
    console.error('Error creating review:', err);
    ctx.throw(500, err.message || 'Internal Server Error');
  }
};

exports.deleteReview = async ctx => {
  try {
    const productId = ctx.params.id;

    const product = await Products.findOne({ id: productId });
    if (!product) {
      ctx.throw(404, 'Product not found.');
    }

    const result = await Reviews.deleteMany({ productId: productId });

    if (result.deletedCount === 0) {
      ctx.throw(404, 'Product reviews not found');
    }

    product.reviews = [];
    await product.save();

    ctx.body = result;
  } catch (err) {
    console.error('Error deleting reviews:', err);
    ctx.throw(500, err.message || 'Internal Server Error');
  }
};
