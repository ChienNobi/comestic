const mongoose = require('mongoose');
const {TABLE_ACTIONS} = require('../commons/constants');
const Log = require('./log');

const Schema = mongoose.Schema;
const tableName = 'Brand';

const beautyTreatment = new Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
            trim: true,
        },
        day: {
            type: Number,
        },
        status: {
            type: Boolean,
            default: true,
        },
        img: {
            type: String,
            default: ''
        },
    },
    {
        timestamps: true,
    },
);

beautyTreatment.post('save', async function (doc) {
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

beautyTreatment.post('findOneAndUpdate', function (doc) {
    const {userId} = this.options;
    const updated = Object.keys(beautyTreatment.paths).reduce((prev, curr) => {
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

beautyTreatment.post('findOneAndDelete', function (doc) {
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

const BeautyTreatment = mongoose.model('BeautyTreatment', beautyTreatment);

module.exports = BeautyTreatment;
