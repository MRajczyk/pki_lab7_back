import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes.js'
import { config } from '../config.js';
import { UserModel } from "./models/user.js";
import { initializeUser } from './seed/user-seeder.js'
import { initializeData } from './seed/data-seeder.js'

// Initialize app 
const app = express(); 

app.use(cors()); 
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended: false})); 
app.get('/', (req, res) => {
  res.json({app: 'Run app auth'}); 
}); 

// Connect to MongoDB 
mongoose.connect(config.URI_MONGO, { 
  useNewUrlParser: true
}).catch(err => console.log('Error: Could not connect to MongoDB.', err)); 

mongoose.connection.on('connected', () => {
  initializeUser().then((err) => {
    if(err) {
      console.log(err.message);
    }
  });

  initializeData().then((err) => {
    if(err) {
      console.log(err.message);
    }
  });
  console.log('Initialized user and data')
}); 
mongoose.connection.on('error', (err) => { 
  console.log('Error: Could not connect to MongoDB.', err); 
});

// Routes app 
app.use('/', routes); 
// Start app 
app.listen(config.PORT_LISTEN, () => { 
  console.log('Listening at port ' + config.PORT_LISTEN);
})