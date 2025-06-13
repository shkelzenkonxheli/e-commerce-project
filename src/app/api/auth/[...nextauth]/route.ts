import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./../../../../../models/User"
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
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

export const GET = handler;
export const POST = handler;
