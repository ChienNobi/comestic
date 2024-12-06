const BeautyTreatment = require('../models/beauty_treatment');
const { validateBeautyTreatment } = require('../utils/validate');

exports.getAllBeautyTreatment = async ctx => {
  try {
    const query = {};
    if (ctx.query.keyword) {
      query.title = { $regex: ctx.query.keyword, $options: 'i' };
    }

    if(ctx.query.status) {
      query.status = ctx.query.status === 'true';
    }

    ctx.body = await BeautyTreatment.find(query);
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getBeautyTreatmentId = async ctx => {
  try {
    const result = await BeautyTreatment.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404, 'Brand not found');
    }

    ctx.body = result;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createBeautyTreatment = async ctx => {
  try {
    const data = ctx.request.body;
    const { error } = validateBeautyTreatment(data);
    if (error) {
      ctx.throw(400, error.details[0].message);
    }

    ctx.body = await new BeautyTreatment({
      ...ctx.request.body,
      _userId: ctx.state.user.id,
    }).save();
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateBeautyTreatment = async ctx => {
  try {
    const data = ctx.request.body;

    const updatedBrand = await BeautyTreatment.findOneAndUpdate(
        { _id: ctx.params.id },
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

exports.deleteBeautyTreatment = async ctx => {
  try {
    const brand = await BeautyTreatment.findOneAndDelete(
        {
          _id: ctx.params.id
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
