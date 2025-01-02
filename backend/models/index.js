const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config);

module.exports = sequelize;


// docker run --name postgres-container -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=your_database -p 5432:5432 postgres