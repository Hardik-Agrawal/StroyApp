const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const session = require("express-session")
const MongoStore = require('connect-mongo')(session)
const passport = require("passport")

//Load config
dotenv.config({ path: './config/config.env' })

//Passport Config
require("./config/passport")(passport)
connectDB();
const app = express();

//Body Parsers
app.use(express.urlencoded())
app.use(express.json())

//logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Handlebars Helpers
const { formatDate, stripTags, turncate, editIcon } = require("./helpers/hbs")

// Handelbars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        turncate,
        editIcon,
    },
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })

}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set Global Variable
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})

//Static
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)