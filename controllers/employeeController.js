const Employee = require("../models/Employee");
const Expense = require("../models/Expense");


async function addExpense(req, res) {
    if (!req.body) {
      return res.send("Request body is empty.");
    }
  
    const { category, amount, date } = req.body;
    const userId = req.session.loggedInUserId;

  
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
  
      return res.send(`<script>alert('Expense added successfully.'); window.history.go(-1);</script>`);
    } catch (err) {
      console.log(err);
      return res.send("<script>alert('Internal server error.'); window.history.go(-1);</script>");
    }
  }

  async function displayExpense(req, res) {
    const userId = req.session.loggedInUserId;
  
    try {
      const expenses = await Expense.find({ userId: userId });
  
      if (expenses.length === 0) {
        return res.send("<script>alert('No expenses found for this user.'); window.history.go(-1);</script>");
      }
  
      res.json(expenses);
    } catch (err) {
      console.log(err);
      return res.send("<script>alert('Internal server error.'); window.history.go(-1);</script>");
    }
  }
module.exports = { addExpense, displayExpense };
