
import { connect } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const mURI: string = `${process.env.MONGODB_URI}`;

connect(mURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then((db) => console.log("db is connected"))
  .catch((err) => console.error(err));

  //connection for mongodb database cluster