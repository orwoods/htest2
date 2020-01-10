const database = require('../database');

module.exports = class Model {
  constructor() {
    this.database = database.instance();
  }
};