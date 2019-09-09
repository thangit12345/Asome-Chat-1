import session from "express-session";
import connectMongo from "connect-mongo";

let mongoStore = connectMongo(session);

/**
 * This variabel is where save session, in this case is mongodb
 */
let sessionStore = new mongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  //autoRemove: "native" //khi cookie het han thi tu dong xoa sessio trong mong de tranh tinh trang luwu nhieu quas trong database

});
/**
 * Config session for app
 * @param app from exactly express
 */
let configSession = (app) => {
  app.use(session({
    key: "express.sid",
    secret: "mySecret",
    //store luu vao database,,neu ko co cais nay thi no luu vao page
    ///muon vay phai cai them module connect-mongo
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  }));
};

module.exports = configSession;