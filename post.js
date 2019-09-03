require('dotenv').config()
const AWS = require('aws-sdk')

// https://dynamodb.us-west-2.amazonaws.com

AWS.config.update({
    dynamodb: {
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT
    }
})

// sam local start-api
const clientdb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async(event, context) => {
    try {
        clientdb.putItem({
            TableName: 'Persons',
            Item: {
                'personKey': { S: '2'},
                'firstName': {S: 'Joe'},
                'lastName': {S: 'Johnson'}
            }
        }, (err, data) => {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data);
            }
          });
    } catch (err) {
        return {
            status: 'error',
            err
        }       
    }
}