const mongoose=require('mongoose');
const env = require('./environment');
mongoose.connect(`${env.db}`, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true, 
 });
const db=mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting to the database'));

db.once('open', function()
{
    console.log('Connected to the database!');
});


module.exports=db;

// mongodb+srv://abhishek:123@cluster0.8efnq.mongodb.net/social?retryWrites=true&w=majority