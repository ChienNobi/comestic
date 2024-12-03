const Router = require('koa-router');
const employeeController = require('../controllers/employee');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', authMiddleware(), employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', authMiddleware(), employeeController.createEmployee);
router.put('/:id', authMiddleware(), employeeController.updateEmployee);
router.delete('/:id', authMiddleware(), employeeController.deleteEmployee);

// auth
router.post('/auth/login', employeeController.login);
router.post('/auth/refresh-token', employeeController.refreshToken);

module.exports = router;
