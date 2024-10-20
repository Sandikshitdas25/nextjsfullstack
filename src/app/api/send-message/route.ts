import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "No user found"
            }, { status: 404})
        }

        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date()}
        user.messages.push(newMessage as Message) //we have to write as Message othrwise it will give error(typescript error hence we are using it for typesafety)
        await user.save()

        return Response.json({
            success: true,
            message: "Sent successfully"
        }, { status: 200 })

    } catch (error) {
        console.log("An error occured", error)
        return Response.json({
            success: false,
            message: "An error occurred"
        }, { status: 500 })
    }
}