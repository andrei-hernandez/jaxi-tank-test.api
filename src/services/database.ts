
import { connect } from 'mongoose';
import * as dotenv from 'dotenv';

//imports the dotenv for use enviroment variables
dotenv.config();

const mURI: string = `${process.env.MONGODB_URI}`;

// use the connect method in mongoose to stablish the connection with the database
connect(mURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then((db) => console.log("db is connected"))
  .catch((err) => console.error(err));