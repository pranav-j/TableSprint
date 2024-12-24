const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");
const bcrypt = require("bcryptjs");

class User extends Model {
  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static validatePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
