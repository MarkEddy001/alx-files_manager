// utils/db.js
import mongodb from 'mongodb';
import envLoader from './loader';

class DBClient {
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) {
        console.error(`MongoDB client not connected to the server: ${err.message}`);
      } else {
        console.log('MongoDB client connected to the server');
        this.db = this.client.db(database);
      }
    });
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  async usersCollection() {
    return this.db.collection('users');
  }

  async filesCollection() {
    return this.db.collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;
