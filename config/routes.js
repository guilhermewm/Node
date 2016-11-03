//controllers/routes.js
/**
 *Mapping routes to send a request to controllers 
 * 
 */
var express = require('express');
var transactionController = require('../transactions/transaction.controller');
var userController = require('../users/user.controller');
var router = express.Router();
var userContactsController = require('../users/contactList.controller');
var groupController = require('../groups/group.controller');
var pendencieController = require('../pendings/pending.controller');
router.get('/',function(req, res){
    res.send("Hello World");
})

//Users
router.post('/user',userController.registerUser);
router.post('/userFromTransaction', userController.registerUserFromTransaction);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/user/:phone', userController.getUser);
router.get('/users', userController.getListAllUsers);
router.post('/contacts', userContactsController.getContact);

//Transactions
router.get('/transactions', transactionController.getListTransactions);
router.get('/transactions/:phone', transactionController.getListTransactionsByUser);
router.get('/transaction/:id',transactionController.getTransaction);
router.delete('/transaction/:id', transactionController.deleteTransaction);
router.put('/transaction', transactionController.updateTransaction);
router.post('/transaction', transactionController.createTransaction);

//Groups
router.post('/group', groupController.createGroup);
router.get('/groups/:phone', groupController.getGroupsByUser);
router.delete('/group/:idgroup/:phone', groupController.acceptDeleteGroup);
router.delete('/groupDeny/:idgroup', groupController.denyDeleteGroup);
router.put('/group/accept', groupController.acceptGroupInvitation);
router.put('/group/deny', groupController.denyGroupInvitation);
router.put('/group/denyDeleteT', groupController.denyDeleteTransactionByGroup);
router.get('/group/:idGroup/transactions', groupController.getTransactionsByGroup);
router.post('/group/transaction',groupController.registerTransactionByGroup);
router.put('/group/:idGroup/transaction',groupController.updateTransactionByGroup);
router.delete('/group/deleteT/:idGroup/:idTransaction/:phoneCreator',groupController.deleteTransactionByGroup);
//router.delete('/group/deleteTransaction/:idGroup/:idTransaction',groupController.sendPendencieDeleteTransaction);
router.get('/group/:idGroup/user/:phone',groupController.getMembersByGroup);

//Pendencies
router.get('/pending/:phone', pendencieController.getListPendencies);


module.exports = router;  