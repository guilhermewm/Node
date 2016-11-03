//controllers/routes.js
/**
 *Mapping routes to send a request to controllers
 *
 */
var express = require('express');
var router = express.Router();

var exampleController = require('../example/group.controller');

router.get('/',function(req, res){
    res.send("Api is online");
})




//Groups
router.post('/group', groupController.createGroup);
router.get('/groups/:id', groupController.getGroupsById);
router.delete('/group/:idgroup', groupController.deleteGroup);
router.put('/group/accept', groupController.acceptGroupInvitation);
router.put('/group/deny', groupController.denyGroupInvitation);
router.put('/group/:idGroup/transaction',groupController.updateTransaction);



module.exports = router;
