const express = require('express');
const { googleAuth } = require('../Controller/authController');
const router = express.Router();

router.post("/google_auth", googleAuth);

module.exports = router; 
