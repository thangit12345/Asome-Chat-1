// var express = require('express');
import express from 'express';
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routers/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import passportLocal from "passport-local";
import http from "http";
import socketio from "socket.io";
import initSocket from "./sockets/index";
import configSocketIo from  "./config/socketio";
import events from "events";
import  * as configApp from "./config/app";
import cookieParser from "cookie-parser";
 
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
//cau hinh cho so luong socket ma trong file index cua socket chungs ta khai bao
events.EventEmitter.defaultMaxListeners = 30;
//init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

//Connect to mongoDB
ConnectDB();

//config session 
session.config(app);

//config view engine
configViewEngine(app);

//Enabel post data for request
app.use(bodyParser.urlencoded({extended: true}))

//enable Flash message
app.use(connectFlash());


//user cookie parser
app.use(cookieParser());

//config passport ks
app.use(passport.initialize());
app.use(passport.session());

initRoutes(app);
 
//config all soket io 
configSocketIo(io, cookieParser, session.sessionStore);

//init all sockets
initSocket(io);
// app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//   console.log(`Hello LeThang I'm running ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
// });

server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello LeThang I'm running ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
});//chay app voi socket