const express = require('express');
const router = express.Router();
const { addExpense, displayExpense, diaplayManagerExpenses, approveExpense, rejectExpense, displayEmployeeExpense, approvePartial  } = require('../controllers/adminController');


router.post('/addExpense', addExpense);
router.get('/displayExpense', displayExpense);
router.get('/displayManagerExpenses', diaplayManagerExpenses)
router.get('/:id/approveExpense', approveExpense);
router.get('/:id/rejectExpense', rejectExpense);
router.get('/displayEmployeeExpenses', displayEmployeeExpense);
router.post('/:id/approvePartial', approvePartial);
module.exports = router;