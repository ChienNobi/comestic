const Category = require('../models/category');
const Product = require('../models/product');
const { validateCategory } = require('../utils/validate');

exports.getAllCategories = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.searchIndex = { $regex: ctx.query.keyword, $options: 'i' };
    }
    const categories = await Category.find(query);

    // Add productCount and productByCategory to each category
    const categoryData = await Promise.all(
      categories.map(async category => {
        const products = await Product.find({ category: category.id });
        return {
          ...category.toObject(),
          productCount: products.length,
          productByCategory: products.map(product => product.id),
        };
      }),
    );

    ctx.body = categoryData;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getCategoryById = async ctx => {
  try {
    const category = await Category.findOne({ id: ctx.params.id });
    if (!category) {
      ctx.throw(404, 'Category not found');
    }

    // Add productCount and productByCategory to the category
    const products = await Product.find({ category: category.id });
    const categoryData = {
      ...category.toObject(),
      productCount: products.length,
      productByCategory: products.map(product => product.id),
    };

    ctx.body = categoryData;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getProductByTypeCategory = async ctx => {
  try {
    const categories = await Category.find({ productType: ctx.params.type })
      .populate('products')
      .exec();
    if (!categories) {
      ctx.throw(404, 'Category not found');
    }

    // Add productCount and productByCategory to each category
    const categoryData = await Promise.all(
      categories.map(async category => {
        const products = await Product.find({ category: category.id });
        return {
          ...category.toObject(),
          productCount: products.length,
          productByCategory: products.map(product => product.id),
        };
      }),
    );
    ctx.body = categoryData;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createCategory = async ctx => {
  try {
    const data = ctx.request.body;
    console.log(data);
    
    const { error } = validateCategory(data);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const hasCategory = await Category.findOne({ id: data.id });
    if (hasCategory) {
      ctx.throw(400, 'Category is already exists');
    }

    const newCategory = new Category(data);
    newCategory._userId = ctx.state.user.id;
    const savedCategory = await newCategory.save();

    ctx.body = savedCategory;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateCategory = async ctx => {
  try {
    const data = ctx.request.body;

    const { error } = validateCategory(data, true);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { id: ctx.params.id },
      data,
      { new: true, userId: ctx.state.user.id },
    );
    if (!updatedCategory) {
      ctx.throw(404, 'Category not found');
    }

    ctx.body = updatedCategory;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteCategory = async ctx => {
  try {
    const category = await Category.findOneAndDelete(
      {
        id: ctx.params.id,
      },
      { userId: ctx.state.user.id, id: ctx.params.id },
    );
    if (!category) {
      ctx.throw(404, 'Category not found');
    }

    ctx.body = category;
  } catch (err) {
    ctx.throw(500, err);
  }
};
