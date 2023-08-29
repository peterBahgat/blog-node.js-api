const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');

const usersRoutes = require('./routes/usersRoutes.js');
const postsRoutes = require('./routes/postsRoutes.js');

const app = express();

const port = process.env.PORT || 8000;
const mongodbURL = process.env.MONGODB_URL;

app.use(morgan('tiny'));
app.use(express.json());
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);

app.listen(port, function (err) {
  if (err) console.log('Error in server setup');
  console.log('Server listening on Port', port);
});

async function mongodbConnect() {
  try {
    await mongoose.connect(mongodbURL);
    console.log('connected to MongoDB successfully');
  } catch (error) {
    console.log(error);
  }
}

mongodbConnect().catch((err) => console.log(err));
