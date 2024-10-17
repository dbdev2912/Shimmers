/**
 * SYSTEM MODULARS IMPORT
 */

const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const sequelize     = require('./config/db')
const handlebars    = require('express-handlebars');

const cors          = require('cors');

/**
 * CUSTOMIZED MODULARS IMPORT
 */

const Controller = require('./controllers/controller');

/**
 * .env CONFIG
 */
require('dotenv').config()

const app = express();


/**
 * 
 * MIDDLEWARES CONFIG
 * 
*/

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Extend request body limit size
 */
app.use(express.json({ limit: '50mb' }));


/**
 * 
 * CORS CONFIGS
 * 
 */

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE,PATCH', 
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors( corsOptions ))


/**
 * 
 * ROUTES
 * 
 */

const AuthApi = require('./routes/users');

app.use('/api/auth', AuthApi);


/**
 * 
 * HANDLE UNEXPECTED 404 NOT FOUND
 * 
 */

app.use(function(req, res, next) {  
  Controller.throw404NotFound(req, res)
});


/**
 * 
 * SYNCHRONIZE DATABASE STATE ONCE SERVER RESTARTS
 * P/s: Anytime models change, set [ FORCE_CHANGE_DATABASE = true ] to apply new structures
 * 
 */

// const FORCE_CHANGE_DATABASE = true;
const FORCE_CHANGE_DATABASE = false;

(async () => {
  await sequelize.sync({ force: FORCE_CHANGE_DATABASE });
})();

module.exports = app;
