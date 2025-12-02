/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useActionState, useEffect, useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/services/auth/loginUser";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const LoginForm = ({ redirect }: { redirect?: string }) => {

    const [state, formAction, isPending] = useActionState(loginUser, null);

    const getFieldError = (fieldName: string) => {
        return state?.errors?.find((err: any) => err.field === fieldName)?.message || null;
    };

    useEffect(() => {
        if (state?.message && state?.success === false) {
            toast.error(state.message);
        }
    }, [state]);


    const [showPassword, setShowPassword] = useState(false)
    return (
        <form action={formAction}>
            {
                redirect && <input type="hidden" name="redirect" value={redirect} />
            }
            <FieldGroup>
                <div className="grid grid-cols-1 gap-4">
                    {/* Email */}
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                        //   required
                        />
                        {
                            getFieldError("email") && (
                                <FieldDescription className="text-red-400" >
                                    {getFieldError('email')}
                                </FieldDescription>
                            )
                        }
                    </Field>

                    {/* Password */}
                    <Field className="relative">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                        //   required
                        />
                        {
                            getFieldError("password") && (
                                <FieldDescription className="text-red-400" >
                                    {getFieldError('password')}
                                </FieldDescription>
                            )
                        }
                        <div>
                            <Button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute bg-transparent hover:bg-transparent inset-y-0 -right-1 mt-8 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                    </Field>
                </div>
                <FieldGroup className="mt-4">
                    <Field>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Logging in..." : "Login"}
                        </Button>

                        <FieldDescription className="px-6 text-center">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </FieldDescription>
                        <FieldDescription className="px-6 text-center">
                            <Link
                                href="/forget-password"
                                className="text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldGroup>
        </form>
    );
};

export default LoginForm;