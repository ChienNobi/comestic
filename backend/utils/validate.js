const Joi = require('joi');
const { PHONE_REGEX, EMAIL_REGEX, FEATURES } = require('../commons/constants');

const validate = (schema, data, isAllOptional = false) => {
  if (isAllOptional) {
    return Joi.object(schema)
      .fork(Object.keys(schema), s => s.optional())
      .validate(data);
  }
  return Joi.object(schema).validate(data);
};

const validateUser = (data, isAllOptional) => {
  const schema = {
    email: Joi.string().min(3).max(100).regex(EMAIL_REGEX).required(),
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().allow(''),
    phone: Joi.string().min(10).max(15).regex(PHONE_REGEX).allow(''),
    address: Joi.string().allow(''),
    imageURL: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    status: Joi.string()
  };
  return validate(schema, data, isAllOptional);
};

const validateEmployee = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required(),
    department: Joi.string().allow(''),
    role: Joi.string().allow(''),
    phone: Joi.string().min(10).max(15).regex(PHONE_REGEX).allow(''),
    password: Joi.string().min(6).allow(''),
  };
  return validate(schema, data, isAllOptional);
};

const validateLogin = data => {
  const schema = {
    email: Joi.string().min(3).max(100).regex(EMAIL_REGEX).required(),
    password: Joi.string().min(6).required(),
  };
  return validate(schema, data);
};

const validateEmployeeLogin = data => {
  const schema = {
    phone: Joi.string().min(10).max(15).regex(PHONE_REGEX).required(),
    password: Joi.string().min(6).required(),
  };
  return validate(schema, data);
};

const validateRole = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required(),
    accessibleFeatures: Joi.array()
      .items(Joi.string().valid(...Object.values(FEATURES)))
      .single()
      .required(),
  };
  return validate(schema, data, isAllOptional);
};

const validateDepartment = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required(),
  };
  return validate(schema, data, isAllOptional);
};

const validateProduct = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required(),
    img: Joi.string().required(),
    imageURLs: Joi.array()
      .items(
        Joi.object({
          color: Joi.object({
            name: Joi.string().required(),
            hex: Joi.string().required(),
          }).required(),
          img: Joi.string().required(),
          sizes: Joi.array().items(Joi.string()).optional(),
        }),
      )
      .optional(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    status: Joi.string().required(),
    productType: Joi.string().required(''),
    description: Joi.string().required(''),
    tags: Joi.array().items(Joi.string()).optional(),
    sizes: Joi.array().items(Joi.string()).optional(),
    discount: Joi.number().optional(),
    additionalInformation: Joi.array().items(Joi.object()).optional(),
  };
  return validate(schema, data, isAllOptional);
};

const validateBrand = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required(),
    logo: Joi.string().optional(),
  };
  return validate(schema, data, isAllOptional);
};

const validateCategory = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required(),
    productType: Joi.string().required(),
    img: Joi.string().optional(),
  };
  return validate(schema, data, isAllOptional);
};

const validateReview = (data, isAllOptional) => {
  const schema = {
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().optional(),
  };
  return validate(schema, data, isAllOptional);
};

const validateCoupon = (data, isAllOptional) => {
  const schema = {
    id: Joi.string().required(),
    title: Joi.string().required(),
    logo: Joi.optional(),
    couponCode: Joi.string().required(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().required(),
    discountPercentage: Joi.number().required(),
    minimumAmount: Joi.number().required(),
    productType: Joi.string().required(),
    status: Joi.string().valid('active', 'inactive').optional(),
  };
  return validate(schema, data, isAllOptional);
};

module.exports = {
  validateLogin,
  validateEmployeeLogin,
  validateUser,
  validateEmployee,
  validateRole,
  validateDepartment,
  validateProduct,
  validateBrand,
  validateCategory,
  validateReview,
  validateCoupon,
};
