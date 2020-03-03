"use strict";
var bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define(
    "Login",
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );

  Login.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  Login.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  Login.associate = function(models) {
    Login.belongsTo(models.User, {
      onDelete: "CASCADE",
      hooks: true,
      foreignKey: {
        name: "UserId",
        allowNull: false
      }
    });
  };
  return Login;
};
