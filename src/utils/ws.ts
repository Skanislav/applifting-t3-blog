import { loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";
import { getEndingLink } from "~/utils/index";

export const wsApi = createTRPCNext<AppRouter>({
  config({ ctx }) {
    // noinspection SuspiciousTypeOfGuard
    return {
      transformer: superjson,

      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        getEndingLink(ctx),
      ],
    };
  },
  ssr: false,
});
