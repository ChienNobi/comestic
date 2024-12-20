const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('koa-jwt');
const { koaBody } = require('koa-body');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('@koa/cors');

const responseMiddleware = require('./middleware/response');
const customJWTMiddleware = require('./middleware/jwt');

// Import routes
const logRoutes = require('./routes/log');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const employeeRoutes = require('./routes/employee');
const roleRoutes = require('./routes/role');
const departmentRoutes = require('./routes/department');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const reviewRoutes = require('./routes/review');
const orderRoutes = require('./routes/order');
const couponRoutes = require('./routes/coupon');
const beautyTreatmentRoutes = require('./routes/beauty_treatment');
const blogRoutes = require('./routes/blog');
const calendarRoutes = require('./routes/calendar');

// Load environment variables
dotenv.config();

// Create Koa application
const app = new Koa();

// Create Koa router
const router = new Router();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(async () => {
    console.log('MongoDB connected...')
  })
  .catch(err => console.log(err));

app.use(koaBody());
app.use(customJWTMiddleware);
app.use(cors());
app.use(responseMiddleware);

// Routes middleware
router.use('/api/user', userRoutes.routes());
router.use('/api/employees', employeeRoutes.routes());
router.use('/api/products', productRoutes.routes());
router.use('/api/roles', roleRoutes.routes());
router.use('/api/logs', logRoutes.routes());
router.use('/api/departments', departmentRoutes.routes());
router.use('/api/categories', categoryRoutes.routes());
router.use('/api/brands', brandRoutes.routes());
router.use('/api/reviews', reviewRoutes.routes());
router.use('/api/orders', orderRoutes.routes());
router.use('/api/coupons', couponRoutes.routes());
router.use('/api/beauty-treatment', beautyTreatmentRoutes.routes());
router.use('/api/blogs', blogRoutes.routes());
router.use('/api/calendars', calendarRoutes.routes());

app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

// Start the server
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Server started on port ${port}`));
