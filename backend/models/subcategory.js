const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");
const Category = require("./category");
const User = require("./user");

class Subcategory extends Model {}

Subcategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subcategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Subcategory",
  }
);

// Define associations
Category.hasMany(Subcategory, { foreignKey: "categoryId", onDelete: "CASCADE" });
Subcategory.belongsTo(Category, { foreignKey: "categoryId" });
User.hasMany(Subcategory, { foreignKey: "userId", onDelete: "CASCADE" });
Subcategory.belongsTo(User, { foreignKey: "userId" });

module.exports = Subcategory;