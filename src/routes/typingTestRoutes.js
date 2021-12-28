const router = require('express').Router();
const typingTestService = require('../services/typingTestService');

router.post('/', typingTestService.analyzeData);

module.exports = router;