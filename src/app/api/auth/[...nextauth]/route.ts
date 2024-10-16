import NextAuth from "next-auth/next";  //dont know we should write next-auth/next or next-auth
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }