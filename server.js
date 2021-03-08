const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const connectDB = require('./config/db');
//load env variables
dotenv.config({path: './config/config.env'});

//connect to database
connectDB();

//routes files
const articles = require('./routes/articles');

const app = express();

//body parser
app.use(express.json());

//middlewares
app.use(logger);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File Uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//MOunt routers
app.use('/api/v1/articles', articles);

app.get('/', (req, res) => {
  res.send('hello from server.js');
});

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server and exit
  server.close(() => process.exit(1));
});
