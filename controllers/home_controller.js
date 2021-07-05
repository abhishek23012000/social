const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');



module.exports.home = async function(req, res){

    try{
    
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');

    
        let users = await User.find({});


        let friends = new Array();
        if (req.user)/* friends list will only be loaded if thhe user is signed in */
        {
            let all_friendships = await Friendship.find({ $or: [{ from_user: req.user._id }, { to_user: req.user._id }] })
                .populate('from_user')
                .populate('to_user');/* checking the friendship model in the fields "from user" and "to_user". the current logged in user has to be in one of them. and at the same time we are also populating it to see the user ids*/

            for (let fs of all_friendships)/* storing all the friendships in an array so that it is easy to load them in the front end quickly */
            {
                if (fs.from_user._id.toString() == req.user._id.toString())
                {
                    friends.push({
                        friend_name: fs.to_user.name,
                        friend_id: fs.to_user._id,
                        friend_avatar:fs.to_user.avatar
                    });
                }
                else if (fs.to_user._id.toString() == req.user._id.toString())
                {
                    friends.push({
                        friend_name: fs.from_user.name,
                        friend_id: fs.from_user._id,
                        friend_avatar:fs.from_user.avatar
                    });
                }
            }
        }
        
        //step 3= rendering the page with all the posts and passing all the users to it.
        var options =
        {
            title:"Home",
            posts: posts,
            all_users: users,
            friends: friends
        };
        return res.render('home', options);
    }
    catch (error)
    {
        console.log('Error', error);
        return;
    }

   
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
