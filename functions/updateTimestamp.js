'use strict';
const resourceLogic = require('../resource/resource.logic')

module.exports.handler = (event, context, callback) => {
  resourceLogic.updateTimeStamp(event.pathParameters.name).then((res) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        result: res,
      }),
    };
    callback(null, response);
  }, (err) => { callback(err); });
};
