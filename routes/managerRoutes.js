const express = require('express');
const router = express.Router();


const { addEmployee, displayEmployeeExpense, addExpense, displayExpense, approveExpense, rejectExpense, finance, PayExpense, approvePartial } = require('../controllers/managerController');

router.post("/addEmployee" , addEmployee);
router.post('/addExpense', addExpense);
router.get('/displayExpense', displayExpense);
router.get('/displayEmployeeExpenses', displayEmployeeExpense);
router.get('/:id/approveExpense', approveExpense);
router.get('/:id/rejectExpense', rejectExpense);
router.post('/:id/approvePartial', approvePartial);
router.get('/finance', finance);
router.post('/payExpense/:id', PayExpense);


module.exports = router;