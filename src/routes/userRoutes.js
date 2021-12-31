const router = require('express').Router();
const userService = require('../services/userService');

router.post('/register', userService.register);
router.post('/login', userService.login);
router.get('/validate', userService.validate);

module.exports = router;