import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes.js'
import { initializeUser } from './seed/user-seeder.js'
import { initializeData } from './seed/data-seeder.js'

const URI_MONGO = process.env.URI_MONGO;
const PORT_LISTEN = process.env.PORT_LISTEN;
// Initialize app 
const app = express();

app.use(cors()); 
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended: false})); 
app.get('/', (req, res) => {
  res.json({app: 'Run app auth'}); 
}); 

// Connect to MongoDB
console.log("Connecting to database...");
mongoose.connect(URI_MONGO, {
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
app.listen(PORT_LISTEN, () => {
  console.log('Listening at port ' + PORT_LISTEN);
})