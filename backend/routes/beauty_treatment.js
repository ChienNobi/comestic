const Router = require('koa-router');
const beautyTreatment = require('../controllers/beauty_treatment');
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.get('/', beautyTreatment.getAllBeautyTreatment);
router.get('/:id', beautyTreatment.getBeautyTreatmentId);
router.post('/', authMiddleware(), beautyTreatment.createBeautyTreatment);
router.put('/:id', authMiddleware(), beautyTreatment.updateBeautyTreatment);
router.delete('/:id', authMiddleware(), beautyTreatment.deleteBeautyTreatment);

module.exports = router;
