# Run AWS Lambda with DynamoDB locally  

### READ CAREFULLY - Skipping steps will likely reduce your chances of success  

##### There are multiple steps to run Lamdba functions locally which connect to a containerized instance of [DynamoDB](https://aws.amazon.com/dynamodb/).  This tutorial provides everything you need.  

# What You Need
Below is the software you need to install (all instructions for a Mac and included below):
- [Python](https://www.python.org/)
- [Homebrew](https://brew.sh)
- [Docker](https://www.docker.com/)
- [Node.js](https://www.nodejs.org/)
- [SAM CLI](https://hub.docker.com/r/amazon/dynamodb-local/)

### Five programs - I realize that's a lot.
If you don't have [Python](https://www.python.org/) and [Homebrew](https://brew.sh) you'll need to get those. 

Next, download and install [Docker](https://www.docker.com/).  Once downloaded, run the command `docker pull amazon/dynamodb-local` to pull the [DynamoDB Image](https://hub.docker.com/r/amazon/dynamodb-local/) - this is provided by AWS and will containerize [DynamoDB](https://aws.amazon.com/dynamodb/) locally. 

Download and install [SAM CLI (Serverless Application Model)](https://aws.amazon.com/serverless/sam/) by running the command `brew tap aws/tap` followed by `brew install aws-sam-cli` - obviously this requires [Homebrew](https://brew.sh).  Alternatively, you may download [SAM CLI](https://aws.amazon.com/serverless/sam/) from [AWS](https://aws.amazon.com/).

Once you have all the software downloaded, run [DynamoDB](https://aws.amazon.com/dynamodb/) locally using the command `docker run -p 8000:8000 amazon/dynamodb-local`. This terminal window will need to remain open as you use DynamoDB.
#### NOTICE - Ending your terminal session terminates your DynamoDB instance and you'll have to re-create and re-seed table contents 

In a new tab, create a table using the below command: 
`aws dynamodb create-table --table-name Persons --attribute-definitions AttributeName=PersonKey,AttributeType=S --key-schema AttributeName=PersonKey,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000`

Next, seed your table with a couple records:
`aws dynamodb put-item --table-name Persons --item '{ "PersonKey": {"S": "1"}, "FirstName": {"S": "Bill"}, "LastName": {"S": "Smith"} }' --return-consumed-capacity TOTAL --endpoint-url http://localhost:8000`

`aws dynamodb put-item --table-name Persons --item '{ "PersonKey": {"S": "2"}, "FirstName": {"S": "John"}, "LastName": {"S": "Smith"} }' --return-consumed-capacity TOTAL --endpoint-url http://localhost:8000` 

In terminal you may view your table's seeded data by running `aws dynamodb scan --table-name Persons --endpoint-url http://localhost:8000`

If you've made it this far and data's returning, you've succesfully containerized DynamoDB. 
Clone this repo and install the dependencies by running `npm install` 
Run `sam local start-api` to run your Lambda function and your browser should load with the seeded records from your DynamoDB table.

You may alternatively run `sam local start-api --skip-pull-image` if you wish to skip pulling down the latest Docker image for the Lambda runtime.