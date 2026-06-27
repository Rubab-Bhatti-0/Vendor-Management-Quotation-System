const mongoose =require ('mongoose');

require('dotenv').config();

const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("successfully connected to db\n");

    }catch(error){
        console.error("Database connection error",error);
    }
    
}


module.exports=connectDB;