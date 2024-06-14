import { env } from 'process';
import express from 'express';

const app = express();
const port = env.PORT || 5000;
const routes = require('./routes/index');

app.use(express.json());
app.use(routes);
app.listen(port, '127.0.0.1');

export default app;
