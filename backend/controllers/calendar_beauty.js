const CalendarBeauty = require('../models/calendar_beauty');

exports.createCalendarBeauty = async ctx => {
    try {
        ctx.body = await new CalendarBeauty({
            ...ctx.request.body,
        }).save();
    } catch (err) {
        ctx.throw(500, err);
    }
};

exports.getAllCalendarBeauties = async ctx => {
    try {
        ctx.body = await CalendarBeauty.find()
            .populate('beauty_treatment_id')
            .populate('user_id');
    } catch (err) {
        ctx.throw(500, err);
    }
};
