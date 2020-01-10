const Match = require('../models/match');

module.exports = {
  addBet: async(matchId, teamId, userId, userIp) => {
    if (!matchId || !teamId || !userId || !userIp) {
      return false;
    }

    await (new Match).addBet(matchId, teamId, userId, userIp);

    return true;
  },

  getAllByUserId: async(userId) => {
     if (!userId) {
       return false;
     }

     const matches = await (new Match).getAllWithUserBets(userId);

     return matches;
   },

   matchWithTeamExists: async(matchId, teamId) => {
     if (!matchId || !teamId) {
       return false;
     }

     const match = await (new Match).get(matchId);
     if (!match) {
       return false;
     }

     if (match.team_a != teamId && match.team_b != teamId) {
       return false;
     }

     return true;
   },

   isItPossibleToBet: async(matchId, userId) => {
     if (!matchId || !userId) {
       return false;
     }

     const match = await (new Match).isExpiredOrHasExistsBet(matchId, userId);
     if (match) {
       return false;
     }

     return true;
   },

   blockedIpForMatch: async(matchId, ip) => {
     if (!matchId || !ip) {
       return false;
     }

     const numberOfBets = await (new Match).numberOfBetsWithIp(matchId, ip);
     if (numberOfBets >= 3) {
       return true;
     }

     return false;
   }
};