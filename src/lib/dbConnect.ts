import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number  //isConnected is optional , if value comes it will be number format
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> { 
    //void means no matter what type of value comes

    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        //console.log(db)

        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully")

    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default dbConnect