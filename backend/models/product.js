const mongoose = require('mongoose');

const Log = require('./log');
const { getUpdatedValue } = require('../utils/helpers');
const { TABLE_ACTIONS, PRODUCT_STATUSES } = require('../commons/constants');

const Schema = mongoose.Schema;
const tableName = 'Product';

const productSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    img: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: false,
    },
    unit: {
      type: String,
    },
    imageURLs: [
      {
        _id: false,
        color: {
          name: {
            type: String,
            trim: true,
          },
          hex: {
            type: String,
            trim: true,
          },
        },
        img: {
          type: String,
        },
        sizes: [String],
      },
    ],
    parentProduct: {
      type: String,
      trim: true,
    },
    childrenProduct: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(PRODUCT_STATUSES),
      default: 'in-stock',
    },
    reviews: [{ type: String, ref: 'Review' }],
    productType: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: false,
    },
    additionalInformation: [
      {
        _id: false,
        key: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    ],
    tags: [String],
    sizes: [String],
    offerDate: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sellCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.virtual('brandData', {
  ref: 'Brand',
  localField: 'brand',
  foreignField: 'id',
  justOne: true,
});

productSchema.virtual('categoryData', {
  ref: 'Category',
  localField: 'category',
  foreignField: 'id',
  justOne: true,
});

productSchema.virtual('reviewData', {
  ref: 'Review',
  localField: 'reviews',
  foreignField: '_id',
  justOne: false, // Hoặc có thể bỏ qua vì false là mặc định
});

// Arrow function don't get their own 'this'. So 'this' variable will empty if use arrow function

productSchema.pre('save', function (next) {
  this.searchIndex = `${this.id} ${this.name}`;
  next();
});

productSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  this._update.searchIndex = `${docToUpdate.id} ${getUpdatedValue(
    this._update.name,
    docToUpdate.name,
  )}`;
  next();
});

productSchema.post('save', function (doc) {
  // Kiểm tra nếu _userId tồn tại (chỉ từ Employee)
  if (doc._userId) {
    const log = new Log({
      tableName,
      action: TABLE_ACTIONS.ADD,
      userId: doc._userId,
      recordId: doc.id,
      time: Date.now(),
    });
    log.save().catch(err => {
      console.error('Error saving log:', err);
    });
  }
});

const logFieldsExcluded = [
  '_id',
  'id',
  '__v',
  'updatedAt',
  'createdAt',
  'searchIndex',
];

productSchema.post('findOneAndUpdate', function (doc) {
  const { userId } = this.getOptions(); // Lấy userId từ options

  if (userId) {
    const updated = Object.keys(productSchema.paths).reduce((prev, curr) => {
      if (
        !logFieldsExcluded.includes(curr) &&
        this.getUpdate().$set &&
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
    log.save().catch(err => {
      console.error('Error saving log:', err);
    });
  }
});

productSchema.post('findOneAndDelete', function (doc) {
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

const Products = mongoose.model('Products', productSchema);

module.exports = Products;
