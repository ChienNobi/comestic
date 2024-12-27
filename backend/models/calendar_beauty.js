const mongoose = require('mongoose');

const calendarBeautySchema = new mongoose.Schema({
    beauty_treatment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BeautyTreatment', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

const Calendar_beauty = mongoose.model('CalendarBeauty', calendarBeautySchema);

module.exports = Calendar_beauty;
