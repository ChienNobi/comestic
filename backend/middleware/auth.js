const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles) => {
  return async (ctx, next) => {
    const token = ctx.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      ctx.status = 401;
      ctx.body = { message: 'Access denied. No token provided.' };
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    ctx.state.user = decoded;
    console.log(decoded)

    if(!allowedRoles || !allowedRoles.length) {
      await next();
      return;
    }

    if (!allowedRoles.includes(decoded.role)) {
      ctx.status = 403;
      ctx.body = { message: 'Access denied. Insufficient permissions.' };
      return;
    }

    await next();
  };
};

module.exports = authMiddleware;
