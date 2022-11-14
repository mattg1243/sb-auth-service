import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import cors from 'cors';
import { loginHandler } from './handlers/index';

dotenv.config();

// load env variables
const PORT = process.env.PORT || 8081;
export const USER_HOST = process.env.USER_HOSTNAME || 'http://localhost:8080';
// create express app
const app = express();
// middleware
app.use(cors());
app.use(express.json());
// routes
app.use(indexRouter);
app.post('/login', loginHandler);
// start server
app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}...`);
});
