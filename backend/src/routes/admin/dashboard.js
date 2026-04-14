const router = require('express').Router();
const ctrl = require('../../controllers/admin/dashboardController');

router.get('/overview', ctrl.overview);

module.exports = router;
