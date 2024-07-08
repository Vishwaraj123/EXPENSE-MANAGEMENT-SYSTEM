const express = require('express');
const router = express.Router();
const { addExpense, displayExpense } = require('../controllers/employeeController');


router.post('/addExpense', addExpense);
router.get('/displayExpense', displayExpense);

module.exports = router;