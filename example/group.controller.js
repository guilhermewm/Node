var express      = require('express'),
    groupService = require('./group.service'),
    constant     = require('./group.constants.json');

module.exports = {

    createGroup:function (req, res, next) {
        var newGroup = ({
            creator:req.body.creator,
            members:req.body.members,
            title:req.body.title,
            description:req.body.description,
            mode:req.body.mode
        })
        if (typeof newGroup.creator == 'undefined' || newGroup.members.length == 0 || typeof newGroup.title == 'undefined'){
            res.status(400).json({error: constant.error.msg_invalid_param});
        }else {
            groupService.createGroup(newGroup).then(function(response){
                res.json(response);
            }).fail(function(err){
                res.status(404).json(err)
            })
        }
    },

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
    },

    deleteGroup:function (req, res, next) {
        var id = req.params.idgroup;
        groupService.acceptDeleteGroup(id, function(response){
            if (response){
                res.json(response);
            }else {
                res.json({});
            }
        })
    },



    acceptGroupInvitation:function(req, res, next){
        var userPhone = req.body.userPhone;
        var id_group = req.body.id_group;

        groupService.acceptGroupInvitation(userPhone,id_group).then(function(response){
            res.json(response);

        }).fail(function(err){
            res.status(404).json(err);
        })
    },
    denyGroupInvitation:function(req, res, next){
        var userPhone = req.body.userPhone;
        var id_group = req.body.id_group;

        groupService.denyGroupInvitation(userPhone,id_group).then(function(response){
            res.json(response);

        }).fail(function(err){
            res.status(404).json(err);
        })
    }
    updateTransaction: function(req, res, next){
       var idGroup = req.body.idGroup;
       var transaction = req.body.transaction;
       if (typeof idGroup == 'undefined' && typeof transaction.valuePaid == 'undefined' && typeof transaction.description == 'undefined'){
           res.status(400).json(constant.error.msg_invalid_param);
       }else {
           groupService.updateTransactionByGroup(idGroup, transaction).then(function(response){
               res.json(response);
           }).fail(function(err){
               res.status(404).json(err);
           })
       }
    }




}
