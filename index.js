// require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
    dynamodb: {
        // endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
        region: 'us-west-2'
    }
})

// sam local start-api

const clientdb = new AWS.DynamoDB.DocumentClient(config)

module.exports.handler = async (event, context) => {
    try {
        const persons = await clientdb.scan({ TableName: "Persons" }).promise()
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ persons })
          }
    } catch (err) {
        return {
            status: 'error',
            err
        }
    }
    
}