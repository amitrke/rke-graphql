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
            let resp:Mongoose = await connect((process.env.DB));
            console.log(JSON.stringify(resp));
            this.isConnected = resp.connection.readyState;
            return resp;
        }
        catch(err){
            console.error(JSON.stringify(err));
        }
    }

}