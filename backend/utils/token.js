const jwt = require('jsonwebtoken');
const { ROLES } = require('../commons/constants');
// generate token
exports.generateToken = user => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      password: user.password,
      role: ROLES.USER,
        _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    },
  );
};

// generate refreshToken
exports.generateRefreshToken = user => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.REFRESH_JWT_EXPIRE_TIME },
  );
};
