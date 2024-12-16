const mongoose = require('mongoose');
const {TABLE_ACTIONS} = require('../commons/constants');
const Log = require('./log');

const Schema = mongoose.Schema;
const tableName = 'Blog';

const blog = new Schema(
    {
        title: {
            type: String,
        },
        category: {
            type: String,
            trim: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        img: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
    },
);

blog.post('save', async function (doc) {
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

blog.post('findOneAndUpdate', function (doc) {
    const {userId} = this.options;
    const updated = Object.keys(blog.paths).reduce((prev, curr) => {
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

const Blog = mongoose.model('Blog', blog);

module.exports = Blog;
