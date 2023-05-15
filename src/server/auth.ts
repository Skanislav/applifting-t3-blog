import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
import { type CreateNextContextOptions } from "@trpc/server/src/adapters/next";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      name: string;
    } & Omit<DefaultSession["user"], "image">;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        // Here we remove the image from the session because we don't need it
        session.user.image = null;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await prisma.user.findUnique({
            where: { name: credentials?.username },
          });
          if (user && user.password === credentials?.password) {
            return { id: user.id, name: user.name, email: user.email };
          } else {
            return null;
          }
        } catch (e) {
          console.error(e);
          return Promise.reject(new Error("Invalid credentials"));
        }
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: CreateNextContextOptions) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
