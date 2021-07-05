 const passport=require('passport');

 const LocalStrategy=require('passport-local').Strategy;

 const User=require('../models/user');

 //authentication using passport
 passport.use(new LocalStrategy({
     usernameField:'email',
    passReqToCallback:true
 },

 function(req,email,password,done){
    User.findOne({email:email},function(err,user) {

        if(err)
        {
            req.flash("error",err);
            return done(err); 
        }
        if(!user || user.password!=password){
             req.flash('error','Invalid Username/password');
            return done(null,false);
        }

        return done(null,user);
    });
 }
 
 
 ));

 // serializing the user to decide which key is to be kept in the cookies.
passport.serializeUser(function(user,done)
{
    done(null, user.id);
});

// De-serializing the user from the key in the cookies.
passport.deserializeUser(function(id,done)
{
    User.findById(id, (error, user)=>
    {
        if(error)
        {
            console.log("error in finding the user!");
            return done(error);
        }
        return done(null, user);
    });
}); 


// check if the user is authenticated
passport.checkAuthentication=function(req, res, next)
{
    // if the user is signed in then pass him on to the next function, i.e. to the next controller action
    if(req.isAuthenticated())
    {
        return next();
    }
    // if the user is not signed in then return him to the sign-in page
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req, res, next)
{
    if(req.isAuthenticated())
    {
        // request.user contains the current signed in user from the session cookie, and we are just sending this to the locals for views.
        res.locals.user=req.user;
    }
    next();
}



module.exports=passport;

