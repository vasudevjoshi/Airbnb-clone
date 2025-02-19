if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const ejsmate = require('ejs-mate');
const path = require('path');
const listingRouter =require('./routes/listing');
const reviewRouter = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const userRouter = require("./routes/user");
app.use((express.urlencoded({extended: true})));
app.set('view engine', 'ejs');
app.set("views",(path.join(__dirname, 'views')));

app.engine('ejs', ejsmate);
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
const dbUrl = process.env.ATLASDB_URL;
main()
.then(() => {
console.log("connected to database")})
.catch((err) => {
    console.error(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}
const store = MongoStore.create({ 
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600

 })
 store.on('error', (err) =>{
    console.log("Error in Mongo Session Store:" + err.message);
 });

sessionOptions={
    store,
    secret :process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})
// app.get("/demo", async (req,res)=>{
//     let fakeuser = new User({
//         email :"student@gmail.com",
//         username: "delta-student"
//     });
//     let registereduser = await User.register(fakeuser,"student");
//     res.send(registereduser);
// });
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get('/', (req, res) => {
    res.redirect("/listings");
});
app.use((error,req,res,next)=>{
    let{message,statusCode } = error;
    res.render('./listings/error.ejs',{error});
});


app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});