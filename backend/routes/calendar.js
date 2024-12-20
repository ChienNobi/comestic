const Router = require('koa-router');
const calendar = require('../controllers/calendar');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', authMiddleware(), calendar.getAllCalendars);
router.get('/:id', calendar.getCalendarById);
router.post('/', authMiddleware(), calendar.createCalendar);
router.put('/:id', authMiddleware(), calendar.updateCalendar);
router.delete('/:id', authMiddleware(), calendar.deleteCalendar);

module.exports = router;
