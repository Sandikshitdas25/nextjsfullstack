import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url) //getting the params in url
        const queryParam = {
            username: searchParams.get('username') //get the param mathched with username by get method
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam) //safeparse will check if the schema is followed or not 
        // console.log(result) (we get many parameters in result value)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []//we are extracting the only errors related to username

            return Response.json({
                success: false,
                message: usernameErrors?.length>0 ? usernameErrors.join(', '): "Invalid query parameter"
            }, { status: 400})
        }

        const { username } = result.data 
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is taken"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}