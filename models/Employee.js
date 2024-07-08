// User
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const employeeschema = new mongoose.Schema({
    name: { type: String,required: true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    designation: {type: String, required: true}
});

const Employee = mongoose.model("Employee", employeeschema);

module.exports = Employee;
