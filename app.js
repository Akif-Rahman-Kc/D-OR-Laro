const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('express-flash')
const dbconnection = require('./models/dbConnection');
const dotenv = require('dotenv')
dotenv.config();

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const partialPath = path.join(__dirname, 'views/partials');
hbs.registerPartials(partialPath)
const layoutPath = path.join(__dirname, 'views/layout');
hbs.registerPartials(layoutPath)
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({ secret: "dorlaro",cookie: { maxAge: oneDay },resave: true,saveUninitialized: true }));
app.use( bodyParser.urlencoded({ extended: true }) );

// cache clear

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(dbconnection)

app.use('/', userRouter);
app.use('/admin_panel', adminRouter);

app.use(function(req, res, next) {
    next(createError(404));
  });

app.listen(3000)

module.exports = app;