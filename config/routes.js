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
router.get('/groups/:id', exampleController.getGroupsById);



module.exports = router;
