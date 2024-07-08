const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Expense = require("../models/Expense");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

async function displayEmployees(req, res) {
  try {
    const employees = await Employee.find({}).populate("department"); // populate department field
    res.json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
}

async function displayManagers(req, res) {
  try {
    const managers = await Manager.find({}).populate("department"); // populate department field
    res.json(managers);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
}

async function displayAdmins(req, res) {
  try {
    const admins = await Admin.find({}); // no need to populate department field for admins
    res.json(admins);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
}

async function displayEmployeeExpenses(req, res){
  try {
    const expenses = await Expense.find({designation: "Employee" });
    const employeeExpenses = expenses.map(expense => ({
      id: expense._id,
      employeeName: expense.name,
      category: expense.category,
      amount: expense.amount,
      department: expense.department,
      date: expense.date,
      ActionByManager: expense.ActionByManager,
      ActionByAdmin: expense.ActionByAdmin,
      ActionByDirector: expense.ActionByDirector
    }));
    return res.json(employeeExpenses);
  } catch (err) {
    console.log(err);
    res.send("Internal server error.");
  }
}

async function displayManagerExpenses(req, res) {
    try {
        const expenses = await Expense.find({designation: "Manager" });
        const employeeExpenses = expenses.map(expense => ({
          id: expense._id,
          employeeName: expense.name,
          category: expense.category,
          amount: expense.amount,
          department: expense.department,
          date: expense.date,
          ActionByAdmin: expense.ActionByAdmin,
          ActionByDirector: expense.ActionByDirector
        }));
        return res.json(employeeExpenses);
      } catch (err) {
        console.log(err);
        res.send("Internal server error.");
      }
}

async function displayAdminExpenses(req, res) {
    try {
        const expenses = await Expense.find({designation: "Admin" });
        const employeeExpenses = expenses.map(expense => ({
          id: expense._id,
          employeeName: expense.name,
          category: expense.category,
          amount: expense.amount,
          department: expense.department,
          date: expense.date,
          ActionByDirector: expense.ActionByDirector
        }));
        return res.json(employeeExpenses);
      } catch (err) {
        console.log(err);
        res.send("Internal server error.");
      }
}

async function createManager(req, res) {
    try {
        const { name, username, password, department } = req.body;
        
        const existingManager = await Manager.findOne({ username: username });
        if (existingManager) {
            return res.send("Username already exists.");
        }
        const newManager = new Manager({
            name: name,
            username: username,
            password: password,
            department: department,
            designation: "Manager"
        });
        await newManager.save();
        return res.send("Manager created successfully.");
    } catch (err) {
        console.log(err);
        return res.send("Internal server error.");
    }
}

async function createAdmin(req, res) {
    try {
        const { name, username, password, department } = req.body;
        
        const existingAdmin = await Admin.findOne({ username: username });
        if (existingAdmin) {
            return res.send("Username already exists.");
        }
        const newAdmin = new Admin({
            name: name,
            username: username,
            password: password,
            department: department,
            designation: "Admin"
        });
        await newAdmin.save();
        return res.send("Admin created successfully.");
    } catch (err) {
        console.log(err);
        return res.send("Internal server error.");
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const userType = req.params.type; // Get the type of user (Employee, Manager, or Admin)
        console.log(userType)

        let user;
        switch (userType) {
            case 'employees':
                user = await Employee.findByIdAndDelete(userId);
                break;
            case 'managers':
                user = await Manager.findByIdAndDelete(userId);
                break;
            case 'admins':
                user = await Admin.findByIdAndDelete(userId);
                break;
            default:
                return res.send("Invalid user type.");
        }

        if (!user) {
            return res.send("User not found.");
        }
        return res.send("User deleted successfully.");
    } catch (err) {
        console.log(err);
        return res.send("Internal server error.");
    }
}

async function editUser(req, res) {
  try {
    const { id, type } = req.params;
    const { name, username, password } = req.body;

    let user;
    switch (req.params.type) {
      case 'Employee':
        user = await Employee.findById(id);
        break;
      case 'Manager':
        user = await Manager.findById(id);
        break;
      case 'Admin':
        user = await Admin.findById(id);
        break;
      default:
        return res.send("Invalid user type.");
    }

    if (!user) {
      return res.send("User not found.");
    }

    user.name = name;
    user.username = username;
    user.password = password;

    await user.save();

    return res.send("User details updated successfully.");
  } catch (err) {
    console.log(err);
    return res.send("Internal server error.");
  }
}

async function getEditUser(req, res) {
    try {
        const { id, type } = req.params;
        console.log(req.params.type)
        let user;
        switch (type) {
            case 'employee':
                user = await Employee.findById(id);
                break;
            case 'manager':
                user = await Manager.findById(id);
                break;
            case 'admin':
                user = await Admin.findById(id);
                break;
            default:
                return res.send("Invalid user type.");
        }

        if (!user) {
            return res.send("User not found.");
        }

        return res.render("editUser", { user });
    } catch (err) {
        console.log(err);
        return res.send("Internal server error.");
    }
}
async function approveExpense(req, res) {
  try {
    const { id } = req.params; // Assuming you're getting the ID from the request parameters
    const { partialAmount } = req.body;

    if (partialAmount == null || partialAmount == undefined) {
      // Log the ID for debugging purposes
      console.log('ID received:', id);

      // Validate the ID before using it
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const expenseId = new ObjectId(id);

      // Find the expense
      const expense = await Expense.findById(expenseId);

      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      // Update the expense
      await Expense.findByIdAndUpdate(expenseId, { ActionByDirector: 'Approved', ApprovedAmount: partialAmount }, { new: true });

      res.send(`<script>alert('Expense approved.'); window.history.go(-1);</script>`);
    } else {
      // Validate the ID before using it
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const expenseId = new ObjectId(id);

      // Update the expense
      await Expense.findByIdAndUpdate(expenseId, { ActionByDirector: 'Approved', ApprovedAmount: partialAmount }, { new: true });

      res.send(`<script>alert('Expense approved.'); window.history.go(-1);</script>`);
    }
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
      const expense = await Expense.findByIdAndUpdate(expenseId, { ActionByDirector: 'Rejected' }, { new: true });
  
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
      const { partialAmount } = req.body; // Assuming you're getting the amount from the request body
  
      // Log the ID for debugging purposes
      console.log('ID received:', id, 'Amount received:', amount);
  
      // Validate the ID before using it
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
  
      const expenseId = new ObjectId(id);
  
      // Find and update the expense
      const expense = await Expense.findByIdAndUpdate(expenseId, { $inc: { Amount: -amount }, ActionByDirector: `Partially Approved`, ApprovedAmount: amount }, { new: true });
  
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.send(`<script>alert('Expense partially approved.'); window.history.go(-1);</script>`);
    } catch (error) {
      console.error('Error approving partial expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


module.exports = { displayEmployees, displayManagers, displayAdmins, displayEmployeeExpenses, displayManagerExpenses,  displayAdminExpenses, createAdmin, createManager, deleteUser, approveExpense, rejectExpense, editUser, getEditUser, approvePartial };