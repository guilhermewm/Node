var express      = require('express'),
    groupService = require('./group.service'),
    constant     = require('./group.constants.json');

module.exports = {
    getGroupsById:function (req, res, next) {
        var id = req.params.id;

        if ( typeof phone == 'undefined'){
            res.status(400).json(constant.error.msg_invalid_param);
        }else {
            groupService.getGroupsById(id).then(function(response){
                if (response){
                    res.json(response);
                }else {
                    res.json({});
                }
            })
        }
    }
}
