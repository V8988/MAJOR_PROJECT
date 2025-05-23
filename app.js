if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const metodOverride = require("method-override");
const path = require("path");
const listingsRoute = require("./Routes/listings.js");
const reviewsRoute = require("./Routes/reviews.js");
const userRoute = require("./Routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const app = express();

const db_url=process.env.ATLASDB_URL;
//Mongo DB Connection
main()
.then(()=>{console.log("Connection Success");})
.catch((err)=>{console.log(err)});


async function main() {
    await mongoose.connect(db_url);
}

app.set("view engine","ejs");
app.engine("ejs",engine);
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(metodOverride("_method"));

const store = MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.once("error",()=>{
    console.log("ERROR : in MONGO SESSION STORE ",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}


app.use(session(sessionOptions));  //Using Session
app.use(flash()); //using Flash

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//server
const port = 3000;
app.listen(port,()=>{
    console.log(`Server Started PORT NUMBER : ${port}`);
});


//Flash Middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currentUser = req.user;
     next();
});


app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

app.get('/',(req,res)=>{
    res.render("./rootPage/root.ejs");
});

app.use((req,res)=>{
    throw new ExpressError(404,"Page Not Found");
})

//Error Handler
app.use((err,req,res,next)=>{
    let {status=500,message="Some Thing Wrong!"} = err;
     res.status(status);
     res.render("./listing/error.ejs",{ message });
});