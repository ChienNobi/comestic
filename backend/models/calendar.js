const mongoose = require('mongoose');
const {TABLE_ACTIONS} = require('../commons/constants');
const Log = require('./log');

const Schema = mongoose.Schema;
const tableName = 'calendarSchema';

const calendarSchema = new Schema(
    {
        title: {
            type: String,
        },
        beauty_treatment_id: {
            type: Schema.Types.ObjectId,
            ref: 'BeautyTreatment',
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        employee_id: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        },
        date: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    },
);

calendarSchema.post('save', async function (doc) {
    const log = new Log({
        tableName,
        action: TABLE_ACTIONS.ADD,
        userId: doc._userId,
        recordId: doc._id,
        time: Date.now(),
    });
    await log.save();
});

const logFieldsExcluded = [
    '_id',
    '__v',
    'updatedAt',
    'createdAt',
    'searchIndex',
];

calendarSchema.post('findOneAndUpdate', function (doc) {
    const {userId} = this.options;
    const updated = Object.keys(calendarSchema.paths).reduce((prev, curr) => {
        if (
            !logFieldsExcluded.includes(curr) &&
            this.getUpdate().$set[curr] !== null &&
            this.getUpdate().$set[curr] !== undefined
        ) {
            prev.push({
                fieldName: curr,
                newValue: this.getUpdate().$set[curr],
            });
        }
        return prev;
    }, []);

    const log = new Log({
        tableName,
        action: TABLE_ACTIONS.UPDATE,
        userId,
        recordId: doc._id,
        time: Date.now(),
        changes: updated,
    });
    log.save();
});

calendarSchema.post('findOneAndDelete', function (doc) {
    const {userId, _id} = this.options;

    const log = new Log({
        tableName,
        action: TABLE_ACTIONS.DELETE,
        userId,
        recordId: _id,
        time: Date.now(),
    });
    log.save();
});

const CalendarSchema = mongoose.model(tableName, calendarSchema);

module.exports = CalendarSchema;
