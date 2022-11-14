import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import cors from 'cors';

dotenv.config();

// load env variables
const PORT = process.env.PORT || 8081;
// create express app
const app = express();
// middleware
app.use(cors());
// routes
app.use(indexRouter);
// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
