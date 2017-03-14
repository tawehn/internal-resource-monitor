'use strict';
var dataContext = require('../dataContext')

module.exports.handler = (event, context, callback) => {
  dataContext.updateTimeStamp(event.pathParameters.name).then((res) => {
    console.log(res);
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        result: res,
      }),
    };
    callback(null, response);
  }, (err) => { callback(err); });
};
