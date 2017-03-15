const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Promise = require('bluebird');
const dynamoDb = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());

module.exports = {
    createResource: createResource,
    getResourceByName: getResourceByName,
    updateTimeStamp: updateTimeStamp,
    updateResource: updateResource,
    listResources: listResources
}

function createResource(name) {
    const now = new Date().toUTCString();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            name: name,
            available: true,
            notified: false,
            lastNotified: null,
            lastSeen: now,
            created: now,
        },
    };
    return dynamoDb.putAsync(params)
        .then((res) => {
            return res.Item;
        });
}

function updateResource(name, available, notified, lastSeen, lastNotified) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            name: name,
        },

        ExpressionAttributeValues: {
            ':available': available,
            ':notified': notified,
            ':lastSeen': lastSeen,
            ':lastNotified': lastNotified
        },
        UpdateExpression: 'SET available = :available, notified = :notified,lastSeen= :lastSeen,lastNotified = :lastNotified',
        ReturnValues: 'ALL_NEW',
    };
    return dynamoDb.updateAsync(params);
}

function listResources() {

}

function getResourceByName(name) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { name: name, },
    };
    return dynamoDb.getAsync(params)
        .then((res) => {
            return res.Item;
        });
}

function updateTimeStamp(resourceName) {
    return getResourceByName(resourceName)
        .then((resource) => {
            if (!resource) return createResource(resourceName);
            return updateResource(resourceName,true,false,new Date().toUTCString(),null);
        });
}




