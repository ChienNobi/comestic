const Router = require('koa-router');
const userController = require('../controllers/user');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', authMiddleware(), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', authMiddleware(), userController.createUser);
router.put('/:id', authMiddleware(), userController.updateUser);
router.put('/', authMiddleware(), userController.updateUser);
router.delete('/:id', authMiddleware(), userController.deleteUser);
// change password
router.patch('/change-password', authMiddleware(), userController.changePassword);

// auth
router.post('/auth/register', userController.createUser);
router.post('/auth/login', userController.login);
router.post('/auth/refresh-token', userController.refreshToken);

module.exports = router;
