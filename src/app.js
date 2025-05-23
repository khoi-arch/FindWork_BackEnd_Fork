const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const routes = require("./routers");

const app = express();
const Database = require("./config/DatabaseConnection");
const { initSocket } = require("./config/socket"); // <-- import hàm khởi tạo socket
const Passport = require("./config/Passport");
const path = require("path");


dotenv.config();



const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({

    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the uploads directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, path) => {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

routes(app);
Passport(app);


// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Database connection
Database.connectDB();

// Routes
routes(app);

// Tạo server và truyền vào socket
const http = require("http");
const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
