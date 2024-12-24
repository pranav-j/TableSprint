// server.js
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const sequelize = require("./models/index");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

// Authenticate the database connection
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully!.................");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:.................", error);
  });

// Sync database models (if necessary)
sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} .................`);
});
