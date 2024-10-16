//a file is required to put some values into jwt token 
//we have declare or redefine the module with this file

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {   //have to implement user to access value and put in token
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }

    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean
            isAcceptingMessages?: boolean
            username?: string
        } & DefaultSession['user'] //whenever there is defaultsession there will be key
        //a key is required in defaultsession , if we dont we have to face some problems during query or enquiry
    }
}

//an alternative way to doing things , doing it for jwt case
declare module "next-auth/jwt" {
    interface JWT {
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
}