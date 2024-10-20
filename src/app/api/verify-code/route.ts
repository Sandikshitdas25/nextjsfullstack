import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request){
    await dbConnect()

    try {
        const { username, code } = await request.json()
        
        // const decodedUsername =  decodeURIComponent(username) //decodeURIComponent converts the URI component to actual component coming from frontend (ex: space are converted to %20) 

        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "User verified"
            }, { status: 200})
        }else if(!isCodeExpired){
            return Response.json({
                success: false,
                message: "Code validity expired"
            }, { status: 400})
        }else {
            return Response.json({
                success: false, 
                message: "Incorrect verification code"
            }, { status: 400 })
        }


    } catch (error) {
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}