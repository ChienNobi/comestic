const Product = require('../models/product');
const { validateProduct } = require('../utils/validate');

exports.getAllProducts = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.searchIndex = { $regex: ctx.query.keyword, $options: 'i' };
    }
    const products = await Product.find(query)
      .select('-_id -__v')
      .populate('brandData', '-_id id name')
      .populate('categoryData', '-_id id name')
      .populate('reviewData', '-__v -id')
      .lean({ virtuals: true }); // Thêm { virtuals: true }
    ctx.body = products;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getProductById = async ctx => {
  try {
    const product = await Product.findOne({ id: ctx.params.id })
      .select('-_id -__v')
      .populate('brandData', '-_id id name')
      .populate('categoryData', '-_id id name')
      .populate({
        path: 'reviewData',
        select: '-__v',
        populate: {
          path: 'userId', // Đảm bảo trường này trỏ đến userId trong Review
          select: 'name imageURL', // Lấy thông tin name và imageURL từ User
        },
      })
      .lean({ virtuals: true }); // Thêm { virtuals: true }

    if (!product) {
      ctx.throw(404, 'Product not found');
    }

    ctx.body = product;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getProductByType = async ctx => {
  try {
    const type = ctx.params.type;
    const query = ctx.query;
    let products = [];
    if (query.new === 'true') {
      products = await Product.find({ productType: type })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('reviewData', '-__v -id')
        .populate('brandData', '-_id id name')
        .populate('categoryData', '-_id id name')
        .lean({ virtuals: true });
    } else if (query.featured === 'true') {
      products = await Product.find({
        productType: type,
        featured: true,
      })
        .populate('reviewData', '-__v -id')
        .populate('brandData', '-_id id name')
        .populate('categoryData', '-_id id name')
        .lean({ virtuals: true });
    } else if (query.topSellers === 'true') {
      products = await Product.find({ productType: type })
        .sort({ sellCount: -1 })
        .limit(8)
        .populate('reviewData', '-__v -id')
        .populate('brandData', '-_id id name')
        .populate('categoryData', '-_id id name')
        .lean({ virtuals: true });
    } else {
      products = await Product.find({ productType: type })
        .populate('reviewData', '-__v -id')
        .populate('brandData', '-_id id name')
        .populate('categoryData', '-_id id name')
        .lean({ virtuals: true });
    }

    ctx.body = products;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getRelatedProducts = async ctx => {
  try {
    const currentProduct = await Product.findOne({ id: ctx.params.id }).lean(); // Changed to findOne
    if (!currentProduct) {
      ctx.throw(400, 'Product not found');
    }

    const relatedProducts = await Product.find({
      category: currentProduct.category,
      id: { $ne: currentProduct.id }, // Ensure it's querying by the string id
    });

    ctx.body = relatedProducts;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getTopRatedProducts = async ctx => {
  try {
    const products = await Product.find({
      reviews: { $exists: true, $ne: [] },
    })
      .select('-_id -__v')
      .populate('reviewData', '-__v -id')
      .lean({ virtuals: true });

    if (!products || products.length === 0) {
      ctx.body = [];
      return;
    }

    const topRatedProducts = products.map(product => {
      const totalRating = product.reviewData.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      const averageRating = totalRating / (product.reviewData.length || 1);

      return {
        ...product,
        rating: averageRating,
      };
    });

    topRatedProducts.sort((a, b) => b.rating - a.rating);

    ctx.body = topRatedProducts;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.reviewProduct = async ctx => {
  try {
    const result = await Product.find({
      reviews: { $exists: true, $ne: [] },
    }).populate({
      path: 'reviews',
      populate: { path: 'id', select: 'name email imageURL' },
    });

    const products = result.filter(product => product.reviews.length > 0);
    ctx.body = products;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.createProduct = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateProduct(data);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const hasProduct = await Product.findOne({ id: data.id });
    if (hasProduct) {
      ctx.throw(400, 'Product is already exists');
    }

    const newProduct = new Product(data);
    newProduct._userId = ctx.state.user.id;
    const savedProduct = await newProduct.save();

    ctx.body = savedProduct;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateProduct = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateProduct(data, true);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: ctx.params.id },
      data,
      { new: true, userId: ctx.state.user.id },
    );
    if (!updatedProduct) {
      ctx.throw(404, 'Product not found');
    }

    ctx.body = updatedProduct;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteProduct = async ctx => {
  try {
    const product = await Product.findOneAndDelete(
      {
        id: ctx.params.id,
      },
      { userId: ctx.state.user.id, id: ctx.params.id },
    );
    if (!product) {
      ctx.throw(404, 'Product not found');
    }

    ctx.body = product;
  } catch (err) {
    ctx.throw(500, err);
  }
};
