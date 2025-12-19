/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FieldGroup, Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
// import { registerPatient } from "@/services/auth/registerPatient";

const RegisterForm = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [state, formAction, isPending] = useActionState(registerPatient, null)
    console.log(state);

    const getFieldError = (fieldName: string) => {
        if (state && state.errors) {
            const error = state.errors.find((err: any) => err.field === fieldName);
            if (error) {
                return error.message;
            } else {
                return null
            }
        } else {
            return null;
        }
    }

    useEffect(() => {
        if (state && !state.success && state.message) {
            toast.error(state.message)
        }
    }, [state])

    return (
        <form action={formAction}>
            <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <Field>
                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                        <Input id="name" name="name" type="text" placeholder="John Doe" />
                        {
                            getFieldError("name") && (
                                <FieldDescription className="text-red-400" >
                                    {getFieldError('name')}
                                </FieldDescription>
                            )
                        }
                    </Field>
                    {/* Address */}
                    <Field>
                        <FieldLabel htmlFor="address">Address</FieldLabel>
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="123 Main St"
                        />
                    </Field>
                    {/* Email */}
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
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
                        />
                        <div>
                            <Button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute bg-transparent hover:bg-transparent inset-y-0 -right-1 mt-8 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {
                            getFieldError("password") && (
                                <FieldDescription className="text-red-400" >
                                    {getFieldError('password')}
                                </FieldDescription>
                            )
                        }
                    </Field>
                    {/* Confirm Password */}
                    <Field className="md:col-span-2 relative">
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                        />
                        <div>
                            <Button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showPassword)}
                                className="absolute bg-transparent hover:bg-transparent inset-y-0 -right-1 mt-8 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {
                            getFieldError("confirmPassword") && (
                                <FieldDescription className="text-red-400" >
                                    {getFieldError('confirmPassword')}
                                </FieldDescription>
                            )
                        }
                    </Field>
                </div>
                <FieldGroup className="mt-4">
                    <Field>
                        <Button type="submit" disabled={isPending}                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>

                        <FieldDescription className="px-6 text-center">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldGroup>
        </form>
    );
};

export default RegisterForm;