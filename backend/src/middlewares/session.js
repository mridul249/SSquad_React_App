// src/middlewares/session.js
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // set to true in production
    sameSite: 'lax',
  },
});

module.exports = sessionMiddleware;
