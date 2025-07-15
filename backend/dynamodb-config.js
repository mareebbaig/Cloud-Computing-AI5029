const AWS = require('aws-sdk');
require("dotenv").config();

const dynamoConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
}

AWS.config.update(dynamoConfig);

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Notes';

// Table schema
const tableParams = {
    TableName: TABLE_NAME,
    KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
};

// Create table if it doesn't exist
async function createTableIfNotExists() {
    try {
        await dynamodb.describeTable({ TableName: TABLE_NAME }).promise();
        console.log(`✅ Table ${TABLE_NAME} already exists`);
    } catch (error) {
        if (error.code === 'ResourceNotFoundException') {
            try {
                console.log(`🔄 Creating table ${TABLE_NAME}...`);
                await dynamodb.createTable(tableParams).promise();
                console.log(`✅ Table ${TABLE_NAME} created successfully`);
                
                // Wait for table to become active
                await dynamodb.waitFor('tableExists', { TableName: TABLE_NAME }).promise();
                console.log(`✅ Table ${TABLE_NAME} is now active`);
            } catch (createError) {
                console.error('❌ Error creating table:', createError);
                throw createError;
            }
        } else {
            console.error('❌ Error checking table:', error);
            throw error;
        }
    }
}

// Initialize DynamoDB connection
async function initializeDynamoDB() {
    try {
        console.log('🔄 Connecting to DynamoDB Local on port 8000...');
        await createTableIfNotExists();
        console.log('✅ DynamoDB connection initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize DynamoDB:', error.message);
        console.log('💡 Make sure DynamoDB Local is running on port 8000');
        return false;
    }
}

module.exports = {
    dynamodb,
    docClient,
    TABLE_NAME,
    initializeDynamoDB
};
