'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Promise = require('bluebird');
const dynamoDb = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());

module.exports = {
    createResource: createResource,
    getResourceByName: getResourceByName,
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
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
    };
    return dynamoDb.scanAsync(params).then((res) => {return res.Items;});
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