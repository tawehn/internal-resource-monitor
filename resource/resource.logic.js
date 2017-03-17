'use strict';

const moment = require('moment');

const dataContext = require('./resource.data.dynamoDB');
const notificationLogic = require('../notification/notification.logic');

module.exports = {
    getAll: getAll,
    updateTimeStamp: updateTimeStamp,
    checkResourceRequiresAttention: checkResourceRequiresAttention,
    processAvailableResource: processAvailableResource,
    processUnavailableResource: processUnavailableResource
}

function getAll() {
    return dataContext.listResources();
}

function updateTimeStamp(resourceName) {
    return dataContext.getResourceByName(resourceName).then(processAvailableResource.bind(this, resourceName));
}

function checkResourceRequiresAttention(resource) {
    var now = new Date();
    var lastSeen = new Date(resource.lastSeen);
    if (resource.notified) return false;
    if (moment(lastSeen).add(process.env.TIMEOUT, 'minutes').isBefore(now)) return true;
}

function processAvailableResource(resourceName, resource) {
    if (!resource) return dataContext.createResource(resourceName);
    if (!resource.available) notificationLogic.sendAvailableMessage(resource.name, new Date().toUTCString());
    return dataContext.updateResource(resourceName, true, false, new Date().toUTCString(), null);
}

function processUnavailableResource(resource) {
    var now = new Date();
    notificationLogic.sendUnavailableMessage(resource.name, resource.lastSeen);
    return dataContext.updateResource(resource.name, false, true, resource.lastSeen, now.toUTCString());
}