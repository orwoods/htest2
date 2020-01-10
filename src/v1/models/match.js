const BaseModel = require('../model');

module.exports = class Match extends BaseModel {
  constructor() {
    super();
  }

  async getAllWithUserBets(userId) {
    const res = await this.database.query(`SELECT m.*, uv.team_id selected_team_id FROM matches m LEFT JOIN user_votes uv ON uv.match_id = m.id AND uv.user_id = $1`, [userId]);

    return res.rows;
  }

  async get(id) {
    const res = await this.database.query(`SELECT * FROM matches WHERE id = $1`, [id]);

    if (!res.rowCount) {
      return false;
    }

    return res.rows[0];
  }

  async isExpiredOrHasExistsBet(id, userId) {
    const res = await this.database.query(`SELECT count(1) FROM matches m 
                                           LEFT JOIN user_votes uv ON uv.match_id = m.id AND uv.user_id = $1
                                           WHERE m.id = $2 AND (
                                            uv.id IS NOT NULL OR 
                                            m.timestamp <= now() + INTERVAL '10 minute'
                                          )`, [userId, id]);

    if (+res.rows[0].count > 0) {
      return true;
    }

    return false;
  }

  async numberOfBetsWithIp(id, ip) {
    const res = await this.database.query(`SELECT count(1) cnt FROM user_votes WHERE match_id = $1 AND ip = $2`, [id, ip]);

    if (!res.rowCount) {
      return 0;
    }

    return res.rows[0].cnt;
  }

  async addBet(matchId, teamId, userId, userIp) {
    await this.database.query(`INSERT INTO user_votes (match_id, timestamp, user_id, team_id, ip) VALUES ($1, NOW(), $2, $3, $4)`, [matchId, userId, teamId, userIp]);
  }
};