const router = require('express').Router();

router.use('/items', require('./items'));
router.use('/users', require('./users'));

module.exports = router;