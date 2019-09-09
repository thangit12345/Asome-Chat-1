import mongoose, { model } from "mongoose";
import bluebird from "bluebird"

require('dotenv').config()
/**
 * Connect to mongooseDB
 */
let connectDB = () => {
  mongoose.Promise  = bluebird;

  //mongdb://localhost:27017/awsome_chat
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  return mongoose.connect(URI, {useMongoClient: true})
};

module.exports = connectDB;