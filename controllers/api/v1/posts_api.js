const Post=require('../../../models/post')
const comment=require('../../../models/comment');
module.exports.index= async function(req,res){

    let posts = await Post.find({})
    .sort('-createdAt')
   .populate('user')
   .populate({
       path: 'comments',
       populate: {
           path: 'user'
       }
   });

    return res.json(200,{
        message: "Listof posts ",
        posts : posts
    })
}

module.exports.destroy=async function(req,res)
{

    try
    {
        let post= await  Post.findById(req.params.id);
        //.id means converting the object id into string
        if(post.user==req.user.id){
            post.remove();
         await comment.deleteMany({post:req.params.id});
            
       



         
                return res.json(200,{
                    message:"post and associated comments deleted successfully"
                });
             
         }else{
        
            return res.json(200,{
                message:"you canot deleted"
            });
        }
    }catch(err){

      console.log('errot',er);
        return res.json(500,{
            message:"interna server"
        });
    }
   
}