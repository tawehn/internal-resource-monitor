'use strict';

const Promise = require('bluebird');
const pushover = Promise.promisifyAll(require('pushover-notifications'));

module.exports = {
    sendMesage: sendMessage
};

function sendMessage(title, message) {
    var p = new pushover({
        user: process.env.PUSHOVER_USER_KEY,
        token: process.env.PUSHOVER_APP_KEY,
    });
    var msg = {
        message: message, 
        title: title,
    };
    p.send(msg);
}