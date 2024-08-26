const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { login, logout } = require("./controllers/loginController");

const employeeRoutes = require("./routes/EmployeeRoutes");
const managerRoutes = require("./routes/managerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const directorRoutes = require("./routes/directorRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose.connect("mongodb://localhost:27017/Expense", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
    })
);

// app.get("/", (req, res) => {
//     res.render("index");
// });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/login", login)
app.get('/logout', logout);

app.use('/employee', employeeRoutes);
app.use('/manager', managerRoutes);
app.use('/admin', adminRoutes);
app.use('/director', directorRoutes);

app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
});
