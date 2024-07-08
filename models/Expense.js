const mongoose = require("mongoose");

const expenseschema = new mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String,required: true},
    designation: { type: String, required:true},
    department: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    ApprovedAmount: { type:Number},
    date: { type: Date, required: true },
    ActionByManager: { type:String, default: "Pending"},
    ActionByAdmin: { type: String , default: "Pending"},
    ActionByDirector: { type: String, default: "Pending"},
    Finance: {type: String, default: "Pending"}

    
});

const Expense = mongoose.model("Expense", expenseschema);

module.exports = Expense;