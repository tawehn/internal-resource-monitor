'use strict';

const resourceLogic = require('../resource/resource.logic')


module.exports.handler = (event, context, callback) => {
  console.log(process.env.PUSHOVER_API_KEY);
  resourceLogic.getAll().then((res) => {
    res
    .filter(resourceLogic.checkResourceRequiresAttention)
    .forEach(resourceLogic.processUnavailableResource);
   
    callback(null, response);
  }, (err) => { callback(err); });
};


