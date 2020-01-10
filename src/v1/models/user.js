const BaseModel = require('../model');

module.exports = class User extends BaseModel {
  constructor() {
    super();
  }

  async getByCredentials(username, password) {
    const res = await this.database.query('SELECT * FROM users WHERE username = $1 AND pass = $2', [username, password]);

    if (!res.rowCount) {
      return false;
    }

    return res.rows[0];
  }
};