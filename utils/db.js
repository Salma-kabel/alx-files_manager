import { env } from 'process';
import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    let host;
    if (env.DB_HOST) {
      host = env.DB_HOST;
    } else {
      host = 'localhost';
    }
    let port;
    if (env.DB_PORT) {
      port = env.DB_PORT;
    } else {
      port = 27017;
    }
    let database;
    if (env.DB_DATABASE) {
      database = env.DB_DATABASE;
    } else {
      database = 'files_manager';
    }
    this.client = new MongoClient(`mongodb://${host}:${port}/${database}`);
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.client.db().collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const filesCollection = this.client.db().collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
