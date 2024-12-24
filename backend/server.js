require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category")
const sequelize = require("./models/index");

const app = express();
// const port = 3000;
const port = process.env.PORT

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb' }));  // Set limit for JSON body (10MB in this example)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // Set limit for URL-encoded data
app.use(cookieParser());

app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    // origin: "http://localhost:5173",
    credentials: true 
}));

app.use("/api/auth", authRoutes);
app.use("/api", categoryRoutes);


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
