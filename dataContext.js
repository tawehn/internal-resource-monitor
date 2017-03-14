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
    const now = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            name: name,
            available: true,
            lastSeen: now,
            created: now,
        },
    };
    return dynamoDb.putAsync(params)
        .then((res) => {
            return res.Item;
        });
}

function updateResource(name) {
    return "RESOURCE UPDATED";
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
        .then((res) => {
            if (!res) return createResource(resourceName);
            else return updateResource(resourceName);
        });
}




