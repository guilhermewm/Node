var express = require('express'),
    transactionService = require('./transaction.service'),
    constant = require('./transaction.constants.json'),
    Transaction = require('./transaction.schema');

module.exports = {
    
    createTransaction:function (req, res, next) {
        var newTransaction = new Transaction({
            creator:req.body.creator,
            valueTotal: req.body.valueTotal,
            description: req.body.description,
            status: req.body.status,
            debtor: req.body.debtor,
            creditor: req.body.creditor,
	        groupId: req.body.groupId
            
        });
        if (typeof newTransaction.valueTotal  == 'undefined' ||  typeof newTransaction.status  == 'undefined' || typeof newTransaction.debtor == 'undefined'|| typeof newTransaction.creditor == "undefined") {
            res.json({status:400,  error: constant.error.msg_invalid_param});
        }else {
            transactionService.createTransaction(newTransaction, function(response){
               
                if (response){
                    res.json(response);
                }else {
                    res.sendStatus(400);
                }
            })
        }
    },

    getListTransactions:function (req, res, next) {
        transactionService.getListTransactions(function(transactions){
            if (transactions){
                res.json(transactions);
            }else {
                res.sendStatus(404);
            }
        })
    },
    
    getListTransactionPendencies:function(req, res, next){
        var phone = req.params.phone;
        if ( typeof phone == 'undefined'){
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            transactionService.getListTransactionPendingStatus(phone, function(err, transactionsPending){
                if (transactionsPending){
                    transactionService.getListTransactionPaymentConfirmStatus(phone, function(err, transactionsPaymentConfirm){
                        if (transactionsPaymentConfirm){
                            res.json(transactionsPending.concat(transactionsPaymentConfirm));
                        }else {
                            res.json(transactionsPending)
                        }
                    })

                }else {
                    transactionService.getListTransactionPaymentConfirmStatus(phone, function(err, transactionsPaymentConfirm){
                        if (transactionsPaymentConfirm){
                            res.json(transactionsPaymentConfirm);
                        }else {
                            res.json(404)
                        }
                    })
                }
            })
        }  
    },

    getListTransactionsByUser:function (req, res, next) {
        var phone = req.params.phone;
        if ( typeof phone == 'undefined'){
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            transactionService.getListTransactionsByUser(phone, function(response){  
                if (response){     
                    res.json(response);
                }else {    
                    res.json({});
                }
            })
        }
    },

    getTransaction:function (req, res, next) {
        var id = req.params.id;
        if ( typeof id == 'undefined'){
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            transactionService.getTransaction(id, function(transaction){
                if (transaction){
                    res.json(transaction);
                }else {
                    res.sendStatus(404);
                }
            })
        }
    },

    deleteTransaction:function (req, res, next) {
        var id = req.params.id;
        if ( typeof id == 'undefined'){
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            transactionService.deleteTransaction(id, function(response){
                if (response){
                    res.json(response);
                }else {
                    res.sendStatus(404);
                }
            })
        }
    },

    updateTransaction:function (req, res, next) {
         var transaction = new Transaction(req.body);

        if ( typeof transaction.valueTotal  == 'undefined' ||  typeof transaction.status  == 'undefined' || typeof transaction.debtor == 'undefined'|| typeof transaction.creditor == "undefined") {
            res.status(400).json({ error: constant.error.msg_invalid_param});
        }else {
            if (transaction.valuePaid == undefined || transaction.valueTotal == transaction.valuePaid || (transaction.status == "accepted") || (transaction.status == "paymentConfirm")){
                transactionService.updateTransaction(transaction, function(response){
                    if (response){
                        res.json(response);
                    }else {
                        res.sendStatus(400);
                    }
                })
            }else {
                transactionService.updateTransaction(transaction, function(response){
                    if (response){
                        var newTransaction = {
                            valuePaid: undefined,
                            status: 'accepted',
                            valueTotal: transaction.valueTotal - transaction.valuePaid,
                            debtor: transaction.debtor,
                            creditor: transaction.creditor,
                            creator:transaction.creator
                        }
                        transactionService.createTransaction(newTransaction, function(response){
                            if (response){
                                res.json(response)
                            }else {
                                res.sendStatus(400);
                            }
                        })
                    }else {
                        res.sendStatus(400);
                    }
                }) 
            }
        }
    }
}