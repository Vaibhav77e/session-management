const express = require('express');
const app = express();
const database = require('./database/database');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user_models');
const bcrypt = require('bcryptjs')


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


const isAuth = (req, res,next) => {
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/login');
    }
}

app.get('/',(req,res)=>{
    res.render('landing');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("User not found");
            return res.redirect('/login');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            console.log("Password doesn't match");
            return res.redirect('/login');
        }

        req.session.isAuth = true;

        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',async(req,res)=>{
    const {username,email,password} = req.body;

    let users = await User.find({email: email});

    if(users.length!==0){
        console.log("User already present");
        return res.redirect('/register');
    }

    const hashPassword = await bcrypt.hash(password,10);

    users = User.create({
        username: username,
        email: email,
        password: hashPassword
    });

    res.redirect('/login');
});

app.get('/dashboard',isAuth,(req,res)=>{
    res.render('dashboard');
});

app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(PORT ,()=>{
    console.log(`Server started on ${PORT}`);
});