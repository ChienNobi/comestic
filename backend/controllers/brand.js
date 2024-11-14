const Brand = require('../models/brand');
const Products = require('../models/product');
const { validateBrand } = require('../utils/validate');

exports.getAllBrands = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.searchIndex = { $regex: ctx.query.keyword, $options: 'i' };
    }
    const brands = await Brand.find(query);

    // Add productCount and productByBrand to each brand
    const brandData = await Promise.all(
      brands.map(async brand => {
        const products = await Products.find({ brand: brand.id });
        return {
          ...brand.toObject(),
          productCount: products.length,
          productByBrand: products.map(product => product.id),
        };
      }),
    );

    ctx.body = brandData;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getBrandById = async ctx => {
  try {
    const brand = await Brand.findOne({ id: ctx.params.id });
    if (!brand) {
      ctx.throw(404, 'Brand not found');
    }

    const products = await Products.find({ brand: brand.id });
    const brandData = {
      ...brand.toObject(),
      productCount: products.length,
      productByBrand: products.map(product => product.id),
    };

    ctx.body = brandData;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createBrand = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateBrand(data);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    const hasBrand = await Brand.findOne({ id: data.id });
    if (hasBrand) {
      ctx.throw(400, 'Brand is already exists');
    }

    const newBrand = new Brand(data);
    newBrand._userId = ctx.state.user.id;
    const savedBrand = await newBrand.save();

    ctx.body = savedBrand;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateBrand = async ctx => {
  try {
    const data = ctx.request.body;

    const updatedBrand = await Brand.findOneAndUpdate(
      { id: ctx.params.id },
      data,
      { new: true, userId: ctx.state.user.id },
    );
    if (!updatedBrand) {
      ctx.throw(404, 'Brand not found');
    }

    ctx.body = updatedBrand;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteBrand = async ctx => {
  try {
    const brand = await Brand.findOneAndDelete(
      {
        id: ctx.params.id,
      },
      { userId: ctx.state.user.id, id: ctx.params.id },
    );
    if (!brand) {
      ctx.throw(404, 'Brand not found');
    }

    ctx.body = brand;
  } catch (err) {
    ctx.throw(500, err);
  }
};
