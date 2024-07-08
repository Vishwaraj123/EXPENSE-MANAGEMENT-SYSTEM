const Employee = require('../models/Employee')
const Manager = require('../models/Manager')
const Expense = require('../models/Expense')
const Admin = require('../models/Admin')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
/**
 * Adds a new employee to the database.
 *
 * @param {Object} req - The request object containing the employee data.
 * @param {Object} res - The response object used to send the result.
 * @return {Promise} A promise that resolves when the employee is added successfully,
 * or rejects with an error message if there is an error.
 */
async function addEmployee(req, res) {
    // Check if request body is empty
    if (!req.body) {
        return res.send("Request body is empty.");
    }

    // Extract employee data from request body
    const { name, username, password, department } = req.body;

    try {
        // Check if employee already exists
        const user = await Employee.findOne({ username });

        if (user) {
            // Send error message and redirect back to previous page
            res.send(`<script>alert('User already exists.'); window.history.go(-1); </script>`);
            return;
        }

        // Create a new employee object
        const newEmployee = new Employee({
            name: name,
            username: username,
            password: password,
            department: department,
        });

        // Save the new employee to the database
        await newEmployee.save();

        // Send success message and redirect back to previous page
        res.send(`<script>alert('Employee added successfully.'); window.history.go(-1);</script>`);
    } catch (err) {
        // Log any errors that occur and send error message
        console.log(err);
        return res.send(`<script>alert('Internal server error.'); window.history.go(-1);</script>`);
    }
}
async function addExpense(req, res) {
    if (!req.body) {
      return res.send("Request body is empty.");
    }
  
    const { category, amount, date } = req.body;
    const userId = req.session.loggedInUserId;
    console.log(userId)
  
    try {
      const user = await Manager.findById(userId);
      if (!user) {
        return res.send("<script>alert(User not found.'); window.history.go(-1);</script>");
      }
  
      const newExpense = new Expense({
        userId: userId,
        name: user.name,
        designation: "Manager",
        department: user.department,
        category: category,
        amount: amount,
        date: date,
        ActionByManager: null,
        ActionByAdmin: "Pending",
        ActionByDirector: "Pending",

      });
  
      await newExpense.save();
  
      return res.send("<script>alert('Expense added successfully.'); window.history.go(-1);</script>");
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

  async function displayEmployeeExpense(req, res) {
    const userId = req.session.loggedInUserId;
    const manager = await Manager.findById(userId);

    try {
      const employees = await Employee.find({ department: manager.department });
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
      const expense = await Expense.findByIdAndUpdate(expenseId, { $set: { ActionByManager: 'Approved', ApprovedAmount: expense.amount } }, { new: true });
  
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
      const expense = await Expense.findByIdAndUpdate(expenseId, { ActionByManager: 'Rejected' }, { new: true });
  
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
      const expense = await Expense.findByIdAndUpdate(expenseId, { $inc: { Amount: -amount }, ActionByManager: `Partially Approved`, ApprovedAmount: amount }, { new: true });
  
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.send(`<script>alert('Expense partially approved.'); window.history.go(-1);</script>`);
    } catch (error) {
      console.error('Error approving partial expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function finance(req, res) {
    try {
      const expenses = await Expense.find({});
      console.log(expenses)
      return expenses;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function PayExpense(req, res) {
    try {
      const expenseId = req.params.id;
      const {modeOfPayment} = req.body;
      console.log(modeOfPayment)
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      expense.Finance = modeOfPayment;
      // console.log(expense.Finance)
      await expense.save();
      return res.json({ message: "Expense paid successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error paying expense" });
    }
  }


module.exports = { addEmployee, displayEmployeeExpense, addExpense, displayExpense, approveExpense, rejectExpense, finance, PayExpense, approvePartial
 }