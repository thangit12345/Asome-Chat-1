// var express = require('express');
import express from 'express';
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routers/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
import passportLocal from "passport-local";
 
//cai nay de chay dang nhap facebook va google tren local

// const fs = require('fs');
// var https = require('https');
// var pem = require('pem');

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }

//   let app = express();
  
//   ConnectDB();

//   configSession(app);
 
//   configViewEngine(app);

//   app.use(bodyParser.urlencoded({extended: true}))

//   app.use(connectFlash());

//   app.use(passport.initialize());
//   app.use(passport.session());

//   initRoutes(app);

//   https.createServer({ key: fs.readFileSync('./key.pem'), cert: fs.readFileSync('./cert.pem') }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//     console.log(`Hello LeThang I'm running ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
//   });
// });



//init app
let app = express();
//Connect to mongoDB
ConnectDB();

//config session 
configSession(app);
//config view engine
configViewEngine(app);

//Enabel post data for request
app.use(bodyParser.urlencoded({extended: true}))

//enable Flash message
app.use(connectFlash());

//config passport ks
app.use(passport.initialize());
app.use(passport.session());

initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello LeThang I'm running ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
});