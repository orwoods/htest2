const repository = require('../repositories/matches');

module.exports = {
  list: async(req, res) => {
    const matches = await repository.getAllByUserId(req.userId);

    res.json(matches);
  },

  makeBet: async(req, res) => {
    const matchId = req.params.matchId;
    const teamId = req.params.teamId;
    const userId = req.userId;
    const userIp = req.ip;

    if (req.sessionData.ip != req.ip) {
      return res.sendStatus(400);
    }

    if (req.sessionData.uaSha1 != req.uaSha1) {
      return res.sendStatus(400);
    }

    if (!await repository.matchWithTeamExists(matchId, teamId)) {
      return res.sendStatus(400);
    }

    if (!await repository.isItPossibleToBet(matchId, userId)) {
      return res.sendStatus(400);
    }

    if (await repository.blockedIpForMatch(matchId, userIp)) {
      return res.sendStatus(400);
    }

    if (!await repository.addBet(matchId, teamId, userId, userIp)) {
      return res.sendStatus(400);
    }

    res.json({
      status: 'ok'
    });
  }
};