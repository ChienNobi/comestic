const Calendar = require('../models/calendar');
const Blog = require("../models/blog");
const {ROLES} = require("../commons/constants");

exports.getAllCalendars = async ctx => {
  try {
    const query = {};
    if(ctx.state?.user?.role === ROLES.EMPLOYEE) {
      query.$or = [{ created_by: ctx.state.user._id }, { employee_id: ctx.state.user._id }];
    }

    if(ctx.query.user_id) {
        query.user_id = ctx.query.user_id;
    }

    if (ctx.query.keyword) {
      query.title = { $regex: ctx.query.keyword, $options: 'i' };
    }

    ctx.body = await Calendar.find(query);
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getCalendarById = async ctx => {
  try {
    const category = await Calendar.findOne({ id: ctx.params.id });
    if (!category) {
      ctx.throw(404, 'Category not found');
    }
    ctx.body = category;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createCalendar = async ctx => {
  try {
    const data = ctx.request.body;
    data.created_by = ctx.state.user._id;

    ctx.body = await new Calendar({
      ...data,
    }).save();
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.updateCalendar = async ctx => {
  try {
    const data = ctx.request.body;

    const updatedBrand = await Calendar.findOneAndUpdate(
        { _id: ctx.params.id },
        data,
    );

    if (!updatedBrand) {
      ctx.throw(404, 'Calendar not found');
    }

    ctx.body = updatedBrand;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteCalendar = async ctx => {
  try {
    const brand = await Blog.findOneAndDelete(
        {
          _id: ctx.params.id
        },
    );

    if (!brand) {
      ctx.throw(404, 'Blog not found');
    }

    ctx.body = brand;
  } catch (err) {
    ctx.throw(500, err);
  }
};
