import { connect, Mongoose } from "mongoose";
export class MongoService {

    private isConnected;

    public connect = async() => {
        
        if (this.isConnected) {
            console.log('Using existing database connection');
            return;
        }

        console.log('Using new database connection');
        try{
            let mongoose:Mongoose = await connect((process.env.DB));
            mongoose.set('debug', true);
            this.isConnected = mongoose.connection.readyState;
            return mongoose;
        }
        catch(err){
            console.error(JSON.stringify(err));
        }
    }

}