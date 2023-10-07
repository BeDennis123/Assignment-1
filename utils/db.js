const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://jjj02:bqC2ptqvfeflfVlp3GEh6XsBXHNiuErxBF4ErI3y4BKqjRS4B4MtosaaIeWDORcr64NecXkO5CyJACDb4kO83A==@jjj02.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@jjj02@.documents.azure.com:10255/?ssl=true';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };