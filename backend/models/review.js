const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: ObjectId, required: true, ref: 'User' },
    productId: {
      type: String,
      required: true,
      ref: 'Product',
    },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String },
  },
  { timestamps: true },
);

ReviewSchema.virtual('productData', {
  ref: 'Product',
  localField: 'productId',
  foreignField: 'id',
  justOne: true,
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
