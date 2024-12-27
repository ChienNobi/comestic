const Router = require('koa-router');
const calendarBeauty = require('../controllers/calendar_beauty');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', calendarBeauty.getAllCalendarBeauties);
router.post('/', authMiddleware(), calendarBeauty.createCalendarBeauty);

module.exports = router;
