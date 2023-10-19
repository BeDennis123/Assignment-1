const { MongoClient, ObjectId } = require('mongodb');

// TODO: Updte your own MongoDB connection string
process.env.MONGODB_URI = 'mongodb://dennis:pQc3yxAdDQH97dNh7TFVik50PYnCKZ6z8AQos10qhmabjCkPf9lZuAPWyAeKexUCWeZo3aRvUWrpACDbXLDZeg==@dennis.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@dennis@.documnets.azure.com:10255/?ssl=true';
if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('eventsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };