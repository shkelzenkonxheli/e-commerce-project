import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "./mongoConnect"; // kontrollo që kjo rrugë është e saktë
import type { NextAuthOptions } from "next-auth";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/User"; // kontrollo casing: "User.js" ose "user.js"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        await mongoose.connect(process.env.MONGODB_URL!);
        const user = await User.findOne({ email });
        const passwordOk = user && bcrypt.compareSync(password, user.password);
        if (passwordOk) return user;
        return null;
      }
    })
  ]
};
