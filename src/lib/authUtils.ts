
export type UserRole = "ADMIN"| "CUSTOMER";

type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/change-password"],
    patterns: []
}

const customerProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/],
    exact: []
}

const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/],
    exact: []
}


export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => {
        // return route.startsWith(pathname)
        return route === pathname;
    })
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
}

export const getRouteOwner = (pathname: string): "ADMIN" | "CUSTOMER" | "Common" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, customerProtectedRoutes)) {
        return "CUSTOMER";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "Common";
    }

    return null
}


export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/admin/dashboard"
    }
    if (role === "CUSTOMER") {
        return "/dashboard"
    }

    return "/"
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean =>{
    const routeOwner = getRouteOwner(redirectPath);

    if(routeOwner === null || routeOwner === "Common"){
        return true;
    }

    if(routeOwner === role){
        return true;
    }
    return false;
}
