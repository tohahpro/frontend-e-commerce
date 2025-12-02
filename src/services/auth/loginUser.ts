/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import z from 'zod'
import { parse } from 'cookie'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getDefaultDashboardRoute, isValidRedirectForRole } from '@/lib/authUtils'
import { setCookie } from './tokenHandlers'

const loginValidationZodSchema =
    z.object({
        email: z.email({
            error: "Email is required"
        }),
        password: z.string("Password is required").min(1, {
            error: "Password is required and must be at least 1 character long"
        }).max(100, {
            error: "Password must be at least 100 character long"
        })
    })


export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const redirectTo = formData.get('redirect') || null
        // step-1
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;

        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        }
        const validatedFields = loginValidationZodSchema.safeParse(loginData)

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                })
            }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auths/login`, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const result = await res.json()

        // step-2
        // const result = await res.json()

        // step-3
        const setCookieHeaders = res.headers.getSetCookie();
console.log(result);
        // step-4
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            // step-4.1
            setCookieHeaders.forEach((cookie: string) => {

                // step-4.2 ## use parse in cookie npm package
                const parsedCookie = parse(cookie);

                // step-4.3 condition check and set cookie
                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie
                }
                else if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie
                }
            })

        } else {
            throw new Error("No Set-Cookie header found")
        }
        // step-5
        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies")
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies")
        }

        // step-6 cookies store help by next/headers
        // const cookieStore = await cookies()

        // step-6.1 Token set in cookies
        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
            path: accessTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite']
        })

        // step-6.2 Token set in cookies
        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
            path: refreshTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite']
        })


        const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_ACCESS_SECRET as string)

        if (typeof verifiedToken === "string") { // string return when token return error
            throw new Error("Invalid Token")
        }

        const userRole: any = verifiedToken.role;

        if (!result.success) {
            throw new Error(result.message || "Login failed")
        }

        if (redirectTo && result.data.needPasswordChange) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`/reset-password?redirect=${requestedPath}`);
            } else {
                redirect("/reset-password");
            }
        }

        if (result.data.needPasswordChange) {
            redirect(`/reset-password`);
        }

        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(requestedPath);
            } else {
                redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
            }
        } else {
            redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
        }

    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : "Login Failed. You might have entered incorrect email or password."}` };
    }
}