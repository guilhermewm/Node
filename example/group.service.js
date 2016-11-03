/**
 *
 * This file contain all methods to access and modify objects in Groups database
 * @author Adrian Lemes
 */
//required libraries and files
var Group              = require('./group.schema'),
    logger             = require('mm-node-logger')(module),
    User               = require('../users/user.schema'),
    userService        = require('../users/user.service'),
    async              = require('async'),
    constant           = require('./group.constants.json'),
    Q                  = require('q');

//export all methods to be accessed externally
var service = {};


service.createGroup = createGroup;
service.getGroupsById = getGroupsById;
service.deleteGroup = deleteGroup;
service.acceptGroupInvitation = acceptGroupInvitation;
service.denyGroupInvitation = denyGroupInvitation;
service.updateTransaction = updateTransactionByGroup;


module.exports = service;


function updateTransactionByGroup(idGroup, transactionUpdated){
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        for (var i = 0; i < group.transactions.length; i++){
            if (group.transactions[i]._id == transactionUpdated._id){
                group.transactions[i] == transactionUpdated;
                group.save(function(err){
                    if (err){
                        deferred.reject(err);
                    }else {
                        deferred.resolve(constant.success.msg_reg_transaction_success);
                    }
                })
            }else if (i == group.transactions.length){
                deferred.reject(constant.error.msg_find_failure_transaction);
            }
        }

    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;
}


function createGroup(group){
   var deferred = Q.defer();
   var newGroup = new Group(group);
   if(newGroup){
     async.map(newGroup.members, function(user, callback){
        userService.getUser(user.phone.value, function(response){
        if (response){
            user._id = response._id;
            user.name = response.name;
            user.phone.value = response.phone.value;
            user.registrationFlag = response.registrationFlag;
            if (newGroup.creator.phone.value == user.phone.value){
                user.flagAccepted = true;
            }else{
                user.flagAccepted = false;
            }
            return callback(null, user)
        }else {
            userService.getValidNumberPhone(user.phone.value).then(function(validNumber){
            user.phone.value = "+"+validNumber;
            user.flagAccepted = false;
            user.registrationFlag = false;
            return callback(null, user)
        })
        }
    })
    },function(err, results){
        newGroup.members = results;
        console.log(newGroup.creator);
        userService.getValidNumberPhone(newGroup.creator.phone.value).then(function(numberValid){
                newGroup.creator.phone.value = "+"+numberValid;
                newGroup.save(function(err){
            if (err) deferred.reject(err);
            else {
                deferred.resolve(constant.success.msg_reg_success);
            }
        })
        })

    });
    return deferred.promise;
   }
}


function getGroupsById(id, callback){
    var deferred = Q.defer();
    if(id){
        Group.find({"_id": id},function(err, groups){
            if (err){
                logger.error(constant.error.msg_mongo_error+": "+err);
                deferred.reject(err);
            }else if (groups[0] == null || groups[0] == undefined){
                deferred.resolve();
            } else {
                deferred.resolve(groups);
            }
        }).sort({updatedAt : 1})
    }else {
        deferred.reject(constant.error.msg_find_failure);
    }
    return deferred.promise;

}

function acceptGroupInvitation (userPhone, id_group){
    var deferred = Q.defer();
    userService.getUser(userPhone, function(user){

       if(user) {
            Group.findById(id_group, function(err, group){

                if (err){
                   deferred.reject(err);
                }else {
                    var newGroup = new Group(group);
                     async.map(newGroup.members, function(user, callback){
                        if (userPhone == user.phone.value){
                            user.flagAccepted = true;
                        }
                        return callback(null, user)

                    },
                    function(err, result){
                        group.members = result;
                        group.save(function(err){
                            if (err) deferred.reject(err);
                            else {
                                deferred.resolve(constant.success.msg_reg_success);
                            }
                        })
                    })
                }
            })
        }else {
            deferred.reject();
        }
    })
return deferred.promise;
}

function denyGroupInvitation (userPhone, id_group){
     var deferred = Q.defer();
    userService.getUser(userPhone, function(user){
         if(user) {
             Group.findById(id_group, function(err, group){
                 if (err){
                   deferred.reject(err);
                 }else {

                    async.waterfall([
                    function(callback){
                       var members =  (group.members).filter(function(member){
                        return member.phone.value != userPhone;
                       })
                       callback(members)
                    }],
                    function(result){
                        group.members = result;
                         group.save(function(err){
                            if (err) deferred.reject(err);
                            else {
                                deferred.resolve(constant.success.msg_reg_success);
                            }
                        })

                    })
                 }
             })
         }else {
             deferred.reject();
         }
    });
    return deferred.promise;
}



    function deleteGroup(id, callback){
          Group.remove({"_id": id}function(err, success){
            if(err){
                logger.error(constant.error.msg_mongo_error+": "+err);
                callback({status: 500, error: err });
            }else{
                callback(success);
            }

      }).fail(function(err){
              logger.error(constant.error.msg_mongo_error+": "+err);
              callback({status: 500, error: err });
      })
    }


var removeByAttr = function(arr, attr, value, callback){
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i].hasOwnProperty(attr)
           && (arguments.length > 2 && arr[i][attr] === value ) ){

           arr.splice(i,1);

       }
    }
    return arr;
}
