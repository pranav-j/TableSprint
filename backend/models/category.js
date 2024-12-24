const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");
const User = require("../models/user.js");

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorySequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Active",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // Image path or URL
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id", // Foreign key references User table's primary key
      },
    },
  },
  {
    sequelize,
    modelName: "Category",
  }
);

// Define associations
User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });

module.exports = Category;
