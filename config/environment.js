const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname,"../production_logs");

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log',{
    interval:"1d",
    path:logDirectory
})

 
const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: " mongodb+srv://abhishek:123@cluster0.8efnq.mongodb.net/social?retryWrites=true&w=majority",
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'abhishek.raut1372@gmail.com',
            pass:  '7050235276'
        }
    },
    google_client_id:'314454998212-9lr7caasdcnmqu7f3clpo0hide1ojhv2.apps.googleusercontent.com' ,
    google_client_secret: 'o4kOtDc7ZO4rOMx5tHg-Ksmd',
    google_call_back_url:  "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}



const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.ALPHA_SESSION_COOKIE_KEY,
    db: process.env.ALPHA_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.ALPHA_GMAIL_USERNAME,
            pass:process.env.ALPHA_GMAIL_PASSWORD  
        }
    },
    google_client_id:process.env.ALPHA_GOOGLE_CLIENT_ID ,
    google_client_secret: process.env.ALPHA_GOOGLE_CLIENT_SECRET,
    // google_call_back_url:  process.env.ALPHA_CALL_BACK_URL,
    google_call_back_url:"http://localhost:8000/users/auth/google/callback",
    
    jwt_secret: process.env.ALPHA_JWT_SECRET,
    morgan:{
        mode:'combined ',
        options:{stream:accessLogStream}
    }
}



module.exports =eval(process.env.ALPHA_ENVIRONMENT)==undefined ? development : eval(process.env.ALPHA_ENVIRONMENT);