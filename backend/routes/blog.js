const Router = require('koa-router');
const blog = require('../controllers/blog');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', blog.getAllBlog);
router.get('/:id', blog.getBlogById);
router.post('/', authMiddleware(), blog.createBlog);
router.put('/:id', authMiddleware(), blog.updateBlog);
router.delete('/:id', authMiddleware(), blog.deleteBlog);

module.exports = router;
