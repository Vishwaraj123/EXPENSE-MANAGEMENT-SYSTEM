const Employee = require("../models/Employee");
const Expense = require("../models/Expense");


async function addExpense(req, res) {
    if (!req.body) {
      return res.send("Request body is empty.");
    }
  
    const { category, amount, date } = req.body;
    const userId = req.session.loggedInUserId;
    console.log(userId)
  
    try {
      const user = await Employee.findById(userId);
      if (!user) {
        return res.send("User not found.");
      }
  
      const newExpense = new Expense({
        userId: userId,
        name: user.name,
        designation: "Employee",
        department: user.department,
        category: category,
        amount: amount,
        date: date,
        status: "Pending",
      });
  
      await newExpense.save();
  
      return res.send("Expense added successfully.");
    } catch (err) {
      console.log(err);
      return res.send("Internal server error.");
    }
  }

  async function displayExpense(req, res) {
    const userId = req.session.loggedInUserId;
  
    try {
      const expenses = await Expense.find({ userId: userId });
  
      if (expenses.length === 0) {
        return res.send("No expenses found for this user.");
      }
  
      res.json(expenses);
    } catch (err) {
      console.log(err);
      return res.send("Internal server error.");
    }
  }
module.exports = { addExpense, displayExpense };
