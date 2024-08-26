const Employee = require('../models/Employee');
const Manager = require('../models/Manager');
const Admin = require('../models/Admin');
const Director = require('../models/Director');
const { finance } = require('./managerController');

async function login(req, res) {
    if (!req.body) {
        return res.send(`<script>alert('Request body is empty.'); window.history.go(-1);</script>`);
    }
    const { designation, username, password } = req.body;
    let loggedInUserId;

    try {
        const User = getDesignation(designation);
        if (!User) {
            return res.send(`<script>alert('Invalid role.'); window.history.go(-1);</script>`);
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.send(`<script>alert('User not found.'); window.history.go(-1);</script>`);
        }

        if (user.password !== password) {
            return res.send(`<script>alert('Incorrect password.'); window.history.go(-1);</script>`);
        }

        const financeData = await finance(); // Rename variable to avoid conflict

        loggedInUserId = user._id;
        req.session.loggedInUserId = loggedInUserId;
        req.session.save();

        switch (designation) {
            case "Employee":
                const employee = user;
                return res.render("Employee", { employee, loggedInUserId });
            case "Manager":
                const manager = user;
                return res.render("Manager", { manager, loggedInUserId, finance: financeData });
            case "Admin":
                const admin = user;
                return res.render("Admin", { admin, loggedInUserId });
            case "Director":
                const director = user;
                return res.render("Director", { director, loggedInUserId });
            default:
                return res.send(`<script>alert('Invalid designation.'); window.history.go(-1);</script>`);
        }
    } catch (err) {
        console.log(err);
        return res.send(`<script>alert('Internal server error.'); window.history.go(-1);</script>`);
    }
}

function getDesignation(designation) {
    switch (designation) {
        case "Employee":
            return Employee;
        case "Manager":
            return Manager;
        case "Admin":
            return Admin;
        case "Director":
            return Director;
        default:
            return null;
    }
}

function logout(req, res) {
    req.session.destroy();
    res.redirect("/");
}

module.exports = { login, logout };
