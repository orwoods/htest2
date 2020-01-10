const express = require('express');
const router = express.Router();

const auth = require('./controllers/auth');
const matches = require('./controllers/matches');

router.post('/token/create', auth.createToken);
router.post('/token/refresh', auth.refreshToken);

router.use('*', auth.verifyToken);

router.get('/matches', matches.list);
router.post('/matches/:matchId/bet/:teamId', matches.makeBet);

module.exports = router;