import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { error } from "console";

//function to authenticate user and inject some details in jwt and session
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",  //name first letter should be capital
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username } //we havenot add this functionality but for the future we added
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password) //we dont have to write credentials.identifier in case of password

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect password")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: { //we got this callbacks from nextauth website 
        
        async jwt({ token, user }) {
            if (user) { //By not defining User in next-auth.d.ts file, below lines will show error
                token._id = user._id?.toString()  //we can't write information into jwt token like this , before that we have to make a next-auth.d.ts file to declare some values in ther (go to next-auth.d.ts)
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },


        async session({ session, token }) { //nextauth is mostly based on session 
            if(token){ //By not defining Session in next-auth.d.ts file, below lines will show error
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
        
    },
    pages: {
        signIn: "/sign-in", //by defining like this we dont need to make a extra page for signin , the next-auth will handle all the things related to signin
        //we can do this for other authentication pages also
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}