import NextAuth from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions"; // ose "../../lib/authOptions"

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
