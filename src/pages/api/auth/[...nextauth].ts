import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { type NextAuthApiHandler } from "next-auth/src";

import { authOptions } from "~/server/auth";

export default function auth(
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthApiHandler {
  if (req.query.nextauth?.includes("callback") && req.method === "POST") {
    console.log(
      "Handling callback request from my Identity Provider",
      req.body
    );
  }

  return NextAuth(req, res, {
    ...authOptions,
  });
}
