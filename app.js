'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//incorporate routes.js
const routes = require("./routes")
app.use(express.json());


// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});



//Use Sequelize's authenticate function to test the database connection. A message should be logged 
//to the console informing the user that the connection was successful or that there was an error.
var sequelize = require("./models").sequelize;
//established: https://sequelize.org/master/manual/getting-started.html
try {(async() =>{ //using async because: await is only valid in async function - terminal message
  await sequelize.authenticate();
  //Use the sequelize.sync() method to sync the model with the database
  await sequelize.sync()
  console.log('Connection has been established successfully!:)');
})() }catch (error) {
  console.error('Unable to connect to the database:', error);
}


app.use('/api', routes);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});


