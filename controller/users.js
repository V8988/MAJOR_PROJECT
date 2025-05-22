const User = require("../models/user");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.registrationRoute = async (req,res,next)=>{
    try{
    let {username,password,email} = req.body;
    let newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            req.flash("error",`${err}`);
            return next(err);
        }
        req.flash("success","You are logged in!");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",`${e}`);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loggingRoute = async (req,res)=>{
    let {username} = req.body;
   req.flash("success",`Welcome Back To Wanderlust : @${username}`);
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
}

module.exports.logoutRoute = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}