'use strict';

const notificationSender = require('./notification.sender.pushover');

module.exports = {
    sendUnavailableMessage: sendUnavailableMessage,
    sendAvailableMessage: sendAvailableMessage,
    sendErrorMessage: sendErrorMessage
};

function sendUnavailableMessage(resourceName, lastSeen) {
    var messageTitle = resourceName + ' now unavailable!';
    var messageBody = messageTitle+"Last seen: "+(new Date(lastSeen).toLocaleString());
    return notificationSender.sendMesage(messageTitle, messageBody);

}

function sendAvailableMessage(resourceName, lastSeen) {
    var messageTitle = resourceName + ' now available!';
    var messageBody = messageTitle+"Last seen: "+(new Date(lastSeen).toLocaleString());
    return notificationSender.sendMesage(messageTitle, messageBody);
}

function sendErrorMessage(message) {

}