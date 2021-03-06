require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
    dynamodb: {
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT
    }
})

const clientdb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event, context) => {
    try {
        const person = await clientdb.get({ TableName: 'Persons', Key: { 'PersonId': event.pathParameters.key } }).promise()
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ person, status: 'success' })
        }
         
    } catch (err) {
        return {
            status: 'error',
            err
        }
    }
}