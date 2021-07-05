
    {
        // method to submit the form data for new post using AJAX
        let createPost = function () {
            let newPostForm = $('#new-post-form');

            newPostForm.submit(function (e) {
                e.preventDefault();

                $.ajax({
                    type: 'post',
                    url: '/posts/create',
                    data: newPostForm.serialize(),
                    success: function (data) {
                        let newPost = newPostDom(data.data.post);
                        $('#posts-list-container>ul').prepend(newPost);
                        deletePost($(' .delete-post-button', newPost));

                        // call the create comment class
                        new PostComments(data.data.post._id);

                        // CHANGE :: enable the functionality of the toggle like button on the new post
                        new ToggleLike($(' .toggle-like-button', newPost));

                        new Noty({
                            theme: 'relax',
                            text: "Post published!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500

                        }).show();

                    }, error: function (error) {
                        console.log(error.responseText);
                    }
                });
            });
        }


        // method to create a post in DOM
        let newPostDom = function (post) {
            // CHANGE :: show the count of zero likes on this post
            return $(`<li id="post-${post._id}">
                        <p>
                        <i class="fa fa-angle-right "></i>
                <i>
                ${post.user.name}
                </i>
                <div style="width:100%; height:fit-content; background-color: rgb(43, 46, 46);">
                    <p style=" padding-top: 15px; padding-left: 10%; padding-bottom: 15px;">
                    ${post.content} 
                   
                   
                </div>
    <div style=" display:inline-block; width: fit-content;">
                            

                          
                                <div style=" display:inline-block; width: fit-content; margin-left: 90%; ">
                                   
                                    <a class="delete-post-button"  href="/posts/destroy/${post._id}"">
                                        <span class="text-right" style="margin-left: 90%;">
                                            <input  type="submit" <i type="submit" class="fa fa-trash-o" style="font-size:25px;color:rgb(213, 101, 101) "></i>
                                        </span>
                                       
                                        
                                    </a>
                                    
                                </div>


            <div style=" display:inline-block; width: fit-content;">
    
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                </a>
            
            </div>
           
                                
                                  
                                
                           





                    

                        <div class="post-comments" style=" border-bottom: solid; border-width: 3px;  margin-bottom: 30px;" >
               
                    <!-- let's give an id to the new comment form, we'll also need to make the same changes in home_posts.js where we're adding a post to the page -->
                    <div style=" height: 30px; margin-left: 30%; ">
                    <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                        <input style="border-radius: 30px; width: 50%; margin-top: 3px;  background-color: rgb(190, 231, 231);" type="text" name="content" placeholder="Type Here to add comment..." required>
                        
                        <input type="hidden" name="post" value=${post._id} >
                        <input type="submit" value="Add Comment" class="btn btn-success btn-sm"  >
                    </form>
                    </div>
        
              
        
                <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                        
                    </ul>
                </div>
            </div>
            


                        
                        
                    </li>`)
        }


        // method to delete a post from DOM
        let deletePost = function (deleteLink) {
            $(deleteLink).click(function (e) {
                e.preventDefault();

                $.ajax({
                    type: 'get',
                    url: $(deleteLink).prop('href'),
                    success: function (data) {
                        $(`#post-${data.data.post_id}`).remove();
                        new Noty({
                            theme: 'relax',
                            text: "Post Deleted",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500

                        }).show();
                    }, error: function (error) {
                        console.log(error.responseText);
                    }
                });

            });
        }





        // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
        let convertPostsToAjax = function () {
            $('#posts-list-container>ul>li').each(function () {
                let self = $(this);
                let deleteButton = $(' .delete-post-button', self);
                deletePost(deleteButton);

                // get the post's id by splitting the id attribute
                let postId = self.prop('id').split("-")[1]
                new PostComments(postId);
            });
        }



        createPost();
        convertPostsToAjax();
    }
