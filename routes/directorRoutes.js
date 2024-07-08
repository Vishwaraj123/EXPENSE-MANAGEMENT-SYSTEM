const express = require('express');
const router = express.Router();

const { displayEmployees, displayManagers, displayAdmins, displayEmployeeExpenses, displayManagerExpenses,  displayAdminExpenses, createAdmin, createManager, deleteUser,approveExpense, rejectExpense, editUser, getEditUser, approvePartial } = require('../controllers/directorController');


router.get('/displayEmployees', displayEmployees);
router.get('/displayManagers', displayManagers);
router.get('/displayAdmins', displayAdmins);

router.get('/displayEmployeeExpenses', displayEmployeeExpenses);
router.get('/displayManagerExpenses', displayManagerExpenses);
router.get('/displayAdminExpenses', displayAdminExpenses);

router.post('/createAdmin', createAdmin);
router.post('/createManager', createManager);

// Define routes for deleting users
// Route for deleting an employee
router.get('/employees/:id', (req, res) => {
    req.params.type = 'employees';
    deleteUser(req, res);
});

// Route for deleting a manager
router.get('/managers/:id', (req, res) => {
    req.params.type = 'managers';
    deleteUser(req, res);
});

// Route for deleting an admin
router.get('/admins/:id', (req, res) => {
    req.params.type = 'admins';
    deleteUser(req, res);
});


// Define routes for editing users
// Route for editing an user
router.post('/editUser/:type/:id', editUser);


// Route for getting user details for editing
router.get('/getEditUser/:type/:id', getEditUser);

// Define routes for getting user details for editing
// Route for getting user details for editing - employee
router.get('/getEditUser/employee/:id', (req, res) => {
    req.params.type = 'employee';
    getEditUser(req, res);
});

// Route for getting user details for editing - manager
router.get('/getEditUser/manager/:id', (req, res) => {
    req.params.type = 'managers';
    getEditUser(req, res);
});

// Route for getting user details for editing - admin
router.get('/getEditUser/admin/:id', (req, res) => {
    req.params.type = 'admins';
    getEditUser(req, res);
});

// Define routes for approving and rejecting expenses
router.post('/approveExpense/:id', approveExpense);
router.get('/rejectExpense/:id', rejectExpense);

router.post('/:id/approvePartial', approvePartial);

module.exports = router;