const User = require("../models/user");
module.exports.renderSignup = (req,res)=>{
        res.render("./users/signup.ejs");
    };
module.exports.singup =async(req,res)=>{
       try{
        let {username, email,password} = req.body;
        let user = new User({email,username});
       let registerdUser = await User.register(user,password);
        console.log(registerdUser); 
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");   
            res.redirect('/listings');
        });
       }
       catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');}
    };

module.exports.renderLogin = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","You are logged in successfully");
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
        next(err);
        }
        req.flash("success","You are logged out successfully");
        res.redirect('/listings');
    }
    );
    };