require('dotenv').config();
require('express-async-errors');
const express = require('express');

const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

const app = express();

const connectDB = require('./db/connect');

const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authentication');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs : 15 * 60 * 1000,
  max : 100
}));

app.use(express.json());

// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

// routes


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);
//app.use('/api/v1/jobs', jobsRouter); //Temporary change, to test if it works when deployed

app.use('/', (req,res) => {
  res.send('Jobs API'); // Dummy route to test if deployment works
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
