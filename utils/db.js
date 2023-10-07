const { MongoClient, ObjectId } = require('mongodb');

// TODO: Updte your own MongoDB connection string
process.env.MONGODB_URI = 'mongodb://admin:43JEjQfx@192.168.0.123:27017/?readPreference=primary&ssl=false&directConnection=true&authMechanism=DEFAULT'
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