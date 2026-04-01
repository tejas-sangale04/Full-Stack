import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username/Email", type: "text", placeholder: "e.g. waiter1" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Search by email, assuming username is entered in the email field for simplicity
        // or modify schema to add username
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username
          }
        });

        // For demo purposes, if user not found, we check the hardcoded demo credentials
        if (!user) {
          const DEMO_USERS = [
            { id: "1", email: "waiter1", password: "waiter123", role: "waiter" },
            { id: "2", email: "chef1", password: "chef123", role: "chef" },
            { id: "3", email: "admin", password: "admin123", role: "admin" },
            { id: "4", email: "customer1", password: "cust123", role: "customer" },
          ];
          
          const demoUser = DEMO_USERS.find(u => u.email === credentials.username && u.password === credentials.password);
          if (demoUser) {
            return { id: demoUser.id, email: demoUser.email, role: demoUser.role };
          }
          return null;
        }

        // If user exists in DB, check password
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-development",
};
