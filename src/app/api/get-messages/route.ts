import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    //user._id is in string form
    //during aggregation pipeline it might give some error so we convert this id to mongoose objectId but in finding the user by id it works
    const userId = new mongoose.Types.ObjectId(user._id)
    
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", 
                messages: { $push: "$messages" }
            }}
        ])

        if(!user || user.length===0){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })

    } catch (error) {
        console.log("Internal server error")
        return Response.json({
            success: false,
            message: "Internal server error"
        })
    }



}
