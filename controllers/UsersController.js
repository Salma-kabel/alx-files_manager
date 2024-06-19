import dbClient from '../utils/db';
import crypto from 'crypto';


class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const existingUser = await dbClient.users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const user = {
      email,
      password: hashedPassword,
    };
    try {
      const result = await dbClient.users.insertOne(user);
      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
