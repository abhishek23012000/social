const queue=require('../config/kue');

const commentMailer=require('../mailers/comment_mailers');

queue.process('emails',function(job,done){
    console.log('emails worker isprocessing a job',job.data);
    commentMailer.newComment(job.data);

    done();

})