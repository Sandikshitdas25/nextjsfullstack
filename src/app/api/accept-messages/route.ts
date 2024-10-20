import { getServerSession } from "next-auth"; //a fn given by next-auth to get the session from backend(some of the user details are present in session)
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions) //we get the session using getserversession func and it needs authoptions which we defined in auth folder
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401})
    }
    //the user._id is string form (look in options.ts)
    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessages: acceptMessages},
            {new: true} //because of new we will get the updated user
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user ){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id
    
    try {
        const  foundUser = await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        console.log("failed to found message accepting status")
        return Response.json({
            success: false,
            message: "failed to found message accepting status"
        }, { status: 500 })
    }
}



