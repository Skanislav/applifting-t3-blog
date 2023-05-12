
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import {createOpenApiNextHandler} from "trpc-openapi";
import {createContext} from "~/server/context";

// export API handler
export default createOpenApiNextHandler({
    router: appRouter,
    createContext,
    onError:
        env.NODE_ENV === "development"
            ? ({ path, error }) => {
                console.error(
                    `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
                );
            }
            : undefined,
});
