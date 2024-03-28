const mongoose = require('mongoose');

const connectDatabase = async()=>{
    mongoose.connect(process.env.DB_URL).then(con=>{
        console.log(`Mongoose database connected : ${con.connection.host}`);
    }).catch(err=>{
        console.log(`Mongoose database connection error : ${err.message}`);
    });
}

module.exports = connectDatabase;