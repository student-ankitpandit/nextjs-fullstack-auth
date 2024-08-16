import { error } from "console";
import mongoose from "mongoose";


export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("mongoDB connected");
        })  

        connection.on('error', (err) => {
            console.log('mongoDB connection error please make sure that DB is up and running: ' + error);
            process.exit()
        })
    } catch (error) {
        console.log("something went wrong in connecting to DB");
        console.log(error)
    }
}