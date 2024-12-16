const Blog = require('../models/blog');
const { validateBlog} = require('../utils/validate');

exports.getAllBlog = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.title = { $regex: ctx.query.keyword, $options: 'i' };
    }

    if(ctx.query.status) {
      query.status = ctx.query.status === 'true';
    }

    ctx.body = await Blog.find(query);
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getBlogById = async ctx => {
  try {
    const result = await Blog.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404, 'Blog not found');
    }

    ctx.body = result;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createBlog = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateBlog(data);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    ctx.body = await new Blog({
      ...ctx.request.body,
      _userId: ctx.state.user.id,
    }).save();
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateBlog = async ctx => {
  try {
    const data = ctx.request.body;

    const updatedBrand = await Blog.findOneAndUpdate(
        { _id: ctx.params.id },
        data,
        { new: true, userId: ctx.state.user.id },
    );

    if (!updatedBrand) {
      ctx.throw(404, 'Blog not found');
    }

    ctx.body = updatedBrand;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteBlog = async ctx => {
  try {
    const brand = await Blog.findOneAndDelete(
        {
          _id: ctx.params.id
        },
        { userId: ctx.state.user.id, id: ctx.params.id },
    );

    if (!brand) {
      ctx.throw(404, 'Blog not found');
    }

    ctx.body = brand;
  } catch (err) {
    ctx.throw(500, err);
  }
};
