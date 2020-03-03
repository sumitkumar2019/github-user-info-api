"use strict";
const _Login_Data = require("../login_data");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Logins", _Login_Data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Logins", null, {});
  }
};
