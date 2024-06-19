import { Buffer } from 'buffer';
import { v4 } from 'uuid';
import redisClient from '../utils/redis';
import crypto from 'crypto';
import dbClient from '../utils/db';

class AuthController {
  static async connect(request, response) {
    try {
      const encode = request.headers.authorization.split(' ')[1];
      const decode = Buffer.from(encode, 'base64').toString().split(':');
      const email = decode[0];
      const password = crypto.createHash('sha1').update(decode[1]).digest('hex');
      const user = await dbClient.client.db().collection('users').findOne({ email });
      if (user.password !== password) {
        response.status(401).json({ error: 'Unauthorized' }).end();
      } else {
        const token = v4();
        await redisClient.set(`auth${token}`, user.id.toString(), 86400);
        response.status(200).json({ token: token }).end();
      }
    } catch (error) {
      response.status(401).json({ error: 'Unauthorized' }).end();
    }
  }

  static async getDisconnect(request, response) {
    const { token } = request;
    await redisClient.del(token);
    response.status(204).end();
  }
}

export default AuthController;
