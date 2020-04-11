# Run AWS SAM with DynamoDB locally  

### READ CAREFULLY - Skipping steps will likely reduce your chances of success  

##### There are multiple steps to run Lamdba functions locally which connect to a containerized instance of [DynamoDB](https://aws.amazon.com/dynamodb/).  This tutorial provides complete instructions to accomplish this.  

[Contact me](https://www.aaronwht.com/contact-me) if you run into problems using this repo or tutorial.  

# What You Need 
Below is the software you need to install (all instructions for use on a Mac):
- [Python](https://www.python.org/)
- [Homebrew](https://brew.sh)
- [Docker](https://www.docker.com/)
- [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
- [Java Runtime Environment (JRE)](https://www.java.com/en/download/)
- [Node.js](https://www.nodejs.org/)
- [AWS CLI](https://aws.amazon.com/cli/) 
- [SAM CLI](https://hub.docker.com/r/amazon/dynamodb-local/)

### EIGHT programs!?!?!? - I realize that's a lot - you may already have a few of them.
If you don't have [Python](https://www.python.org/) and [Homebrew](https://brew.sh) you'll need to get those. 

Next, download and install [Docker](https://www.docker.com/).  Once downloaded, run the command `docker pull amazon/dynamodb-local` to pull the [DynamoDB Image](https://hub.docker.com/r/amazon/dynamodb-local/) - this is provided by AWS and will containerize [DynamoDB](https://aws.amazon.com/dynamodb/) locally. 

#### NOTICE - If you don't take this step you will receive an "Internal server error"  

Ensure Docker and DynamoDB can run locally by adding your application and `dynamodb` folders to Docker's `File Sharing` directories by selecting `Preferences` from the Docker menu:  
![Docker Preferences](https://www.aaronwht.com/images/aws-sam-dynamodb-local/docker-preferences.png)

![Docker Preferences](https://www.aaronwht.com/images/aws-sam-dynamodb-local/docker-configuration.png)  

My local applications run in the `/apps` folder so I've added it.  You also need to ensure Docker can containerize DynamoDB - I installed DynamoDB in the folder `/dynamodb` so I provided that location to Docker as well (as pictured above).  After making those changes you'll have to select `Apply & Restart`.

In order to persist data you'll need a folder for the containerized version of DynamoDB to save data.  I selected a generic folder of `/data` (where I also store MongoDB's data) and will pass it as a flag to run a containerized version of DynamoDB.  

Once you have all the software downloaded you should be able to run [DynamoDB](https://aws.amazon.com/dynamodb/) locally using the below command:  
`docker run -p 8000:8000 -v $(pwd)/local/dynamodb:/data/ amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath /data`.  
![DynamoDB Locally](https://www.aaronwht.com/images/aws-sam-dynamodb-local/dynamodb-local.png)  

This terminal window will need to remain open as you use DynamoDB.  

Again, notice the `-dbPath /data`.  If you're storing your DynamoDB's data somewhere else you'll need to specify that folder location.  

If for any reason the above command doesn't work, you may try a non-persistent containerized version of DynamoDB by running the below command:  
`docker run -p 8000:8000 amazon/dynamodb-local`.  

This command will NOT PERSIST DATA.  Every time you restart your container (restart Docker, restart your computer) all data will be erased as it is only saved into the container's memory.  

Presuming you have DynamoDB running in a Docker container, download and install [SAM CLI (Serverless Application Model)](https://aws.amazon.com/serverless/sam/) if you haven't done so.  You may do this by running the command `brew tap aws/tap` followed by `brew install aws-sam-cli` - obviously this requires [Homebrew](https://brew.sh).  Alternatively, you may download [SAM CLI](https://aws.amazon.com/serverless/sam/) from [AWS](https://aws.amazon.com/). 

In a new tab, create a table using the below command: 
`aws dynamodb create-table --table-name Persons --attribute-definitions AttributeName=PersonKey,AttributeType=S --key-schema AttributeName=PersonKey,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000`

Next - seed your table with a couple records:
`aws dynamodb put-item --table-name Persons --item '{ "PersonKey": {"S": "1"}, "FirstName": {"S": "Bill"}, "LastName": {"S": "Smith"} }' --return-consumed-capacity TOTAL --endpoint-url http://localhost:8000`

`aws dynamodb put-item --table-name Persons --item '{ "PersonKey": {"S": "2"}, "FirstName": {"S": "John"}, "LastName": {"S": "Smith"} }' --return-consumed-capacity TOTAL --endpoint-url http://localhost:8000` 

In terminal, you may view your table's seeded data by running `aws dynamodb scan --table-name Persons --endpoint-url http://localhost:8000`

If you've made it this far and data's being returned, you've successfully containerized DynamoDB. 
Clone this repo and install the dependencies by running `npm install` 
Run `sam local start-api` to run your Lambda function and your browser should load with the seeded records from your DynamoDB table. 

Pointing your browser to `http://localhost:3000` should return a screen similar to the one below:  
![Docker Preferences](https://www.aaronwht.com/images/aws-sam-dynamodb-local/records.png)

Visiting `http://localhost:3000/record/1` should return a single record:  
![Docker Preferences](https://www.aaronwht.com/images/aws-sam-dynamodb-local/record.png)

You may alternatively run `sam local start-api --skip-pull-image` if you wish to skip pulling down the latest Docker image for the Lambda runtime.
