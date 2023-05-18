import { createWSClient, wsLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { type NextPageContext } from "next";

import { env } from "~/env.mjs";
import { type AppRouter } from "~/server/api/root";

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        if (!ctx?.req?.headers) {
          return {};
        }
        // on ssr, forward client's headers to the server
        return {
          ...ctx.req.headers,
          "x-ssr": "1",
        };
      },
    });
  }
  const client = createWSClient({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    url: env.NEXT_PUBLIC_WS_URL,
  });
  return wsLink<AppRouter>({
    client,
  });
}
