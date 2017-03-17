'use strict';

const resourceLogic = require('../resource/resource.logic')


module.exports.handler = (event, context, callback) => {
  resourceLogic.getAll().then((res) => {
    res
    .filter(resourceLogic.checkResourceRequiresAttention)
    .forEach(resourceLogic.processUnavailableResource);
   
    callback(null, "Success!");
  }, (err) => { callback(err); });
};


