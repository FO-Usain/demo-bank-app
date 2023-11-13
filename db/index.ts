import mongoose from "mongoose";

const host = process.env.DB_SERVER;
const db = process.env.DB;

if (host && db) {
    
    console.log(`Attempting to connect to database ${db}`);

    mongoose.connect(`mongodb://${host}/${db}`).then(() => {
        console.log(`connected to database '${db}', successfully!!!`);
    }).catch(err => {
        console.log(`Error connecting to database: ${err}`);
    })
}