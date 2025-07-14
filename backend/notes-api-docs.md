# Notes API

A simple Node.js application for managing notes with RESTful API endpoints, using DynamoDB Local for data persistence.

## Features

- Create new notes
- Retrieve all notes
- Retrieve specific notes by ID
- JSON responses with proper error handling
- Input validation
- DynamoDB Local integration for data persistence

## Prerequisites

1. **Node.js** (v14 or later)
2. **DynamoDB Local** running on port 8000

### Setting up DynamoDB Local

#### Option 1: Using Java (Recommended)
1. Download DynamoDB Local from [AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
2. Extract the files
3. Run DynamoDB Local:
```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8000
```

#### Option 2: Using Docker
```bash
docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

The application will automatically create the required `Notes` table when it starts.

## Installation

1. Ensure DynamoDB Local is running on port 8000 (see Prerequisites above)

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The application will automatically:
- Connect to DynamoDB Local on port 8000
- Create the `Notes` table if it doesn't exist
- Display connection status in the console

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Get All Notes
- **Method**: GET
- **URL**: `/notes`
- **Response**: Array of all notes

**Example Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "My First Note",
      "content": "This is the content of my first note",
      "createdAt": "2025-07-14T10:30:00.000Z",
      "updatedAt": "2025-07-14T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Note by ID
- **Method**: GET
- **URL**: `/notes/:id`
- **Response**: Single note object

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My First Note",
    "content": "This is the content of my first note",
    "createdAt": "2025-07-14T10:30:00.000Z",
    "updatedAt": "2025-07-14T10:30:00.000Z"
  }
}
```

#### 3. Create New Note
- **Method**: POST
- **URL**: `/notes`
- **Content-Type**: application/json

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content goes here"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Note Title",
    "content": "Note content goes here",
    "createdAt": "2025-07-14T10:30:00.000Z",
    "updatedAt": "2025-07-14T10:30:00.000Z"
  }
}
```

## Testing the API

You can test the API using tools like:
- **curl**
- **Postman**
- **Thunder Client** (VS Code extension)

### Example curl commands:

#### Get all notes:
```bash
curl http://localhost:3000/notes
```

#### Create a new note:
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "This is a test note"}'
```

#### Get a specific note:
```bash
curl http://localhost:3000/notes/[NOTE_ID]
```

## Error Handling

The API returns appropriate HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **404**: Not Found
- **500**: Internal Server Error

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## DynamoDB Configuration

The application connects to DynamoDB Local with the following configuration:
- **Endpoint**: http://localhost:8000
- **Region**: local
- **Table Name**: Notes
- **Primary Key**: id (String)

### Table Schema
```json
{
  "TableName": "Notes",
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

The application will automatically create this table when it starts if it doesn't already exist.

## Troubleshooting

### DynamoDB Connection Issues
1. **Error: "Failed to initialize DynamoDB"**
   - Ensure DynamoDB Local is running on port 8000
   - Check if port 8000 is available
   - Verify Java is installed (for DynamoDB Local)

2. **Table Creation Issues**
   - The application automatically creates the Notes table
   - If there are issues, you can manually create the table using AWS CLI:
   ```bash
   aws dynamodb create-table --table-name Notes --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000
   ```

### Viewing DynamoDB Data
You can use AWS CLI to view data in DynamoDB Local:
```bash
# List all tables
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Scan all notes
aws dynamodb scan --table-name Notes --endpoint-url http://localhost:8000
```
