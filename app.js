const express = require('express');
const app = express();
const database = require('./database/database');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const PORT = 3000;

// setting up the database
database();

// set up mongodb session connect for storing the sessions

const store = new MongoDBSession({
    uri:process.env.DB_URL,
    collection:"mySessions",
});

app.use(session({
    secret:"secret-key-whatever",
    resave:false,
    saveUninitialized:false,
    store:store
}));

//set template engine
app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.render('landing');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.listen(PORT ,()=>{
    console.log(`Server started on ${PORT}`);
});