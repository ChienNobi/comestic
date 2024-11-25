const Router = require('koa-router');
const departmentController = require('../controllers/department');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', authMiddleware(), departmentController.createDepartment);
router.put('/:id', authMiddleware(), departmentController.updateDepartment);
router.delete('/:id', authMiddleware(), departmentController.deleteDepartment);

module.exports = router;
