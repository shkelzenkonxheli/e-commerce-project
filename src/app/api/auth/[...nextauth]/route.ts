import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./../../../../../models/User"
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "../../../../../lib/mongoConnect";

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials', 
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
       const email=credentials?.email;
       const password=credentials?.password;
       mongoose.connect(process.env.MONGODB_URL);
       const user=await User.findOne({email});
       const passwordOk=user && bcrypt.compareSync(password, user.password);
       console.log({passwordOk});
       if(passwordOk){
        return user;
       }
       return null
      }
    })
  ]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
