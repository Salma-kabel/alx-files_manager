import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log(err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.GET).bind(this.client);
    return getAsync(key);
  }

  async set(key, val, dur) {
    const setAsync = promisify(this.client.SET).bind(this.client);
    return setAsync(key, val, 'EX', dur);
  }

  async del(key) {
    const delAsync = promisify(this.client.DEL).bind(this.client);
    return delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
