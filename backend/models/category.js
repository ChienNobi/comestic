const mongoose = require('mongoose');
const { TABLE_ACTIONS } = require('../commons/constants');
const Log = require('./log');
const { getUpdatedValue } = require('../utils/helpers');
const { PRODUCT_TYPES } = require('../commons/constants');

const Schema = mongoose.Schema;
const tableName = 'Category';

const CategorySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    img: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: Object.values(PRODUCT_TYPES),
    },
    searchIndex: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Arrow function don't get their own 'this'. So 'this' variable will empty if use arrow function

CategorySchema.pre('save', function (next) {
  this.searchIndex = `${this.id} ${this.name}`;
  next();
});

CategorySchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  this._update.searchIndex = `${docToUpdate.id} ${getUpdatedValue(
    this._update.name,
    docToUpdate.name,
  )}`;
  next();
});

CategorySchema.post('save', function (doc) {
  const log = new Log({
    tableName,
    action: TABLE_ACTIONS.ADD,
    userId: doc._userId,
    recordId: doc.id,
    time: Date.now(),
  });
  log.save();
});

const logFieldsExcluded = [
  '_id',
  'id',
  '__v',
  'updatedAt',
  'createdAt',
  'searchIndex',
];

CategorySchema.post('findOneAndUpdate', function (doc) {
  const { userId } = this.options;
  const updated = Object.keys(CategorySchema.paths).reduce((prev, curr) => {
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
    recordId: doc.id,
    time: Date.now(),
    changes: updated,
  });
  log.save();
});

CategorySchema.post('findOneAndDelete', function (doc) {
  const { userId, id } = this.options;

  const log = new Log({
    tableName,
    action: TABLE_ACTIONS.DELETE,
    userId,
    recordId: id,
    time: Date.now(),
  });
  log.save();
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
