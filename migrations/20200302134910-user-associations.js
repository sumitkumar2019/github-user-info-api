"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("Logins", "UserId", {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        }
      })
      .catch(err => {
        console.error("associatin failed");
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Logins", "UserId").catch(err => {
      console.error("associatin failed");
    });
  }
};
