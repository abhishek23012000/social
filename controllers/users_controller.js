const User = require('../models/user');
const Friendship = require('../models/friendship');
const fs=require('fs');
const path=require('path');

module.exports.profile = (req, res) =>
{
    User.findById(req.params.id, function (error, user)
    {
        if (error)
        {
            console.log('error in finding the user profile!');
            return;
        }

        let are_friends = false;

        Friendship.findOne({
            $or: [{ from_user: req.user._id, to_user: req.params.id },
            { from_user: req.params.id, to_user: req.user._id }]
        }, function (error, friendship)
        {
            if (error)
            {
                console.log('There was an error in finding the friendship', error);
                return;
            }
            if (friendship)
            {
                are_friends = true;
            }
            /* console.log(req.user);
            console.log(req.user._id, '********', req.params.id, '*******') */
            var options =
            {
                user_name: "Abhishek",
                title: "Alpha",
                profile_user: user,/* it is the user whose profile i am currently browsing */
                are_friends: are_friends
            }
            return res.render('users_profile', options);
        })


    });

}


module.exports.update= async  function(req,res)
{
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unathorized');
    // }

    if((req.user.id==req.params.id)){

        try{

            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                    if(err)
                    {
                        console.log('****multer error',err);
                     
                    }
                   user.name=req.body.name;
                   user.email=req.body.email;
                   console.log(req.path);
                   if(req.file){

                    if (user.avatar)
                    {
                        if (fs.existsSync(path.join(__dirname, '..', user.avatar)))
                        {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }

                    user.avatar=User.avatarPath+'/'+req.file.filename;

                       //this is the saving  
                   }
                   user.save();
                   return res.redirect('back');
            });

        }catch{
            req.flash('error', err);
        return res.redirect('back');
        }



    }else{
        req.flash('error','unathorized');
        return res.status(401).send('Unathorized');

    }
}





//render the signup
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
   
    return res.render('user_sign_up', {
        title: "Codeial | Sign up"
    });
}

module.exports.signIn = function (req, res) {
   
    if (req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    } 
    return res.render('user_sign_in', {
        title: "Codeial | Sign in"
    });
}

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log('error in finding user in signing up');
            return;
        }

        if (!user) {
            User.create(req.body, function () {
                if (err) {
                    console.log('error in craetung while signning  up');
                    return res;
                }
                return res.redirect('/users/sign-in')
            })
        } else {
            return res.redirect('back');
        }

    });

}



module.exports.createSession = function (req, res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res)
{
    req.logout();
    req.flash('success','You have logged out');
 
    /* now i have added the flash message in the request. so now this message needs to be 
    transferred to the response, now either i can send it below as an object, but then
    what is the use? everytime i will be sending a separate context just for the flash
    message. so we dont need to do that. so lets create our own custom middleware. go to
    config and create a new file called middleware.js(this can be any name.) and proceed
    with it further. */
    return res.redirect('/');
}