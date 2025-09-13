import { MongoClient } from 'mongodb';

const uri = process.env.MONGODBCONEXION;

if (!uri) {
  throw new Error('Agrega tu uri de MongoDB a .env.local');
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;