/**
 *
 * This file contain all methods to access and modify objects in Groups database
 * @author Adrian Lemes
 */
//required libraries and files
var Group              = require('./group.schema'),
    logger             = require('mm-node-logger')(module),
    async              = require('async'),
    constant           = require('./group.constants.json'),
    Q                  = require('q');

//export all methods to be accessed externally
var service = {};


service.getGroupsById = getGroupsById;


module.exports = service;


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
