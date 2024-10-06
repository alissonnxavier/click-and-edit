import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/dist/server/api-utils";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((request) => {
    if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }

    //TODO: Redirect user away from "/auth" if not authenticated

    if (isPublicPage(request) && isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};