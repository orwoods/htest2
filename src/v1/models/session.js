const BaseModel = require('../model');

module.exports = class Session extends BaseModel {
  constructor() {
    super();
  }

  async create(userId, uuid, ip) {
    await this.database.query('INSERT INTO sessions (ip, uuid, user_id, timestamp) VALUES ($1, $2, $3, NOW())', [ip, uuid, userId]);
  }

  async getByUUID(uuid) {
    const res = await this.database.query('SELECT * FROM sessions WHERE uuid = $1', [uuid]);
    if (!res.rowCount) {
      return false;
    }

    return res.rows[0];
  }

  async remove(id) {
    await this.database.query('DELETE FROM sessions WHERE id = $1', [id]);
  }
};