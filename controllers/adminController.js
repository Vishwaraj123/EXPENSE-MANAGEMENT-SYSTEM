const Admin = require("../models/Admin");
const Manager = require("../models/Manager");
const Expense = require("../models/Expense");
const Employee = require("../models/Employee");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

async function addExpense(req, res) {
    if (!req.body) {
      return res.send("Request body is empty.");
    }
  
    const { category, amount, date } = req.body;
    const userId = req.session.loggedInUserId;
    console.log(userId)
  
    try {
      const user = await Admin.findById(userId);
      if (!user) {
        return res.send("User not found.");
      }
  
      const newExpense = new Expense({
        userId: userId,
        name: user.name,
        designation: "Admin",
        department: user.department,
        category: category,
        amount: amount,
        date: date,
        ActionByDirector: "Pending",
      });
  
      await newExpense.save();
  
      return res.send("Expense added successfully.");
    } catch (err) {
      console.log(err);
      return res.send("Internal server error.");
    }
  }

  async function displayExpense(req,res){
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

  async function diaplayManagerExpenses(req, res) {
    const userId = req.session.loggedInUserId;
    const admin = await Admin.findById(userId);

    try {
      const managers = await Manager.find({ department: admin.department });
      const employeeExpenses = [];

      for (const employee of managers) {
        const expenses = await Expense.find({ userId: employee._id });
        expenses.forEach(expense => {
          employeeExpenses.push({
            id: expense._id,
            employeeName: employee.name,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            ActionByAdmin: expense.ActionByAdmin,
            ActionByDirector: expense.ActionByDirector
          });
        });
      }
      // console.log(employeeExpenses)
      return res.json(employeeExpenses);
    } catch (err) {
      console.log(err);
      res.send("Internal server error.");
    }
  }

  async function displayEmployeeExpense(req, res) {
    const userId = req.session.loggedInUserId;
    const admin = await Admin.findById(userId);

    try {
      const employees = await Employee.find({ department: admin.department });
      const employeeExpenses = [];

      for (const employee of employees) {
        const expenses = await Expense.find({ userId: employee._id });
        expenses.forEach(expense => {
          employeeExpenses.push({
            id: expense._id,
            employeeName: employee.name,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            ActionByManager: expense.ActionByManager,
            ActionByAdmin: expense.ActionByAdmin
          });
        });
      }
    //   console.log(employeeExpenses)
      return res.json(employeeExpenses);
    } catch (err) {
      console.log(err);
      res.send("Internal server error.");
    }
    
  }
  async function approveExpense(req, res) {
    try {
      const { id } = req.params; // Assuming you're getting the ID from the request parameters
  
      // Log the ID for debugging purposes
      console.log('ID received:', id);
  
      // Validate the ID before using it
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
  
      const expenseId = new ObjectId(id);
  
      // Find and update the expense
      const expense = await Expense.findByIdAndUpdate(expenseId, { $set: { ActionByAdmin: 'Approved', ApprovedAmount: expense.amount } }, { new: true });
  
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.send(`<script>alert('Expense approved.'); window.history.go(-1);</script>`);
    } catch (error) {
      console.error('Error approving expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function rejectExpense(req, res) {
    try {
      const { id } = req.params; // Assuming you're getting the ID from the request parameters
  
      // Log the ID for debugging purposes
      console.log('ID received:', id);
  
      // Validate the ID before using it
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
  
      const expenseId = new ObjectId(id);
  
      // Find and update the expense
      const expense = await Expense.findByIdAndUpdate(expenseId, { ActionByAdmin: 'Rejected' }, { new: true });
  
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.send(`<script>alert('Expense rejected.'); window.history.go(-1);</script>`);
    } catch (error) {
      console.error('Error rejecting expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  async function approvePartial(req, res) {
    try {
      const { id } = req.params; // Assuming you're getting the ID from the request parameters
      const { amount } = req.body; // Assuming you're getting the amount from the request body
  
      // Log the ID for debugging purposes
      console.log('ID received:', id, 'Amount received:', amount);
  
      // Validate the ID before using it
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
  
      const expenseId = new ObjectId(id);
  
      // Find and update the expense
      const expense = await Expense.findByIdAndUpdate(expenseId, { $inc: { Amount: -amount }, ActionByAdmin: `Partially Approved`, ApprovedAmount: amount }, { new: true });
  
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.send(`<script>alert('Expense partially approved.'); window.history.go(-1);</script>`);
    } catch (error) {
      console.error('Error approving partial expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

    
  

module.exports = { addExpense, displayExpense, diaplayManagerExpenses, approveExpense, rejectExpense, displayEmployeeExpense, approvePartial }