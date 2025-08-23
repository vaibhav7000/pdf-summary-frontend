import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import { baseBackendUrl } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import OTP from "../components/OTP";
import Loading from "../components/Loading";
import { useSetAtom } from "jotai";
import userAtom from "../store/userStore";
import { emailSchema } from "../utils/zod/zod";
import { BaseResponseType, ForbiddenType, LengthRequiredType, LoginPayloadType } from "../utils/types/types";
import generateToastDefault from "../utils/toasts";

export interface LoginPayload {
    phrase: string;
    msg: string;
    token?: string;
    issues?: ZodError[];
    firstname?: string;
    lastname?: string;
    newUrl?: string;
    summary: string;
}

export default function Login() {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [withOtp, setWithOtp] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false);

    const [isEmailInvalid, setIsEmailValid] = useState<boolean>(true);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
    const [forgetPassword, setForgetPassword] = useState<boolean>(false);
    const [forgetPasswordLinkSent, setForgetPasswordLinkSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const setUserAtom = useSetAtom(userAtom);

    useEffect(function() {
        emailRef.current?.focus();
    }, []);

    const sendLoginRequest = useCallback(async function() {
        const apiUrl: string = `${baseBackendUrl}/login/${withOtp ? "otp" : "password"}`;

        if(!emailRef.current) {
            generateToastDefault("Something up with the frontend")
            setIsEmailValid(false);
            return;
        }

        if(!emailRef.current.value) {
            generateToastDefault("Enter valid email");
            return;
        }


        const payload: {
            email: string;
            password?: string;
        } = {
            email: emailRef.current.value
        }

        if(!withOtp) {
            if(passwordRef.current?.value) {
                payload["password"] = passwordRef.current.value
            } else {
                alert("Enter a valid password")
                setIsPasswordValid(false);
                return;
            }
        }

        try {
            setLoading(true)
            const response: Response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    ...payload,
                })
            });

            const output = await response.json();
            console.log(response);

            setLoading(false)

            if(response.status === StatusCodes.LENGTH_REQUIRED) {
                const final = output as LengthRequiredType;
                final.issues?.forEach(err => {
                    generateToastDefault(err.message, "error");
                });

                return;
            }

            if(response.status === StatusCodes.FORBIDDEN) {
                const final = output as ForbiddenType;
                generateToastDefault(final.msg, "error");
                return;
            }

            if(withOtp) {
                setOtpSent(true);
                return;
            }

            const final = output as LoginPayloadType;
            let token: string = "";

            if(final.token) {
                token = `Bearer ${output["token"]}`
            };
            
            setUserAtom({
                token: token,
                firstname: final["firstname"],
                lastname: final["lastname"],
            });

            navigate("/", {
                replace: true
            })
        } catch (error) {
            
        }
    }, [withOtp]);

    const passwordResetLink = useCallback(async () => {
        let email = emailRef.current?.value;
        const result = emailSchema.safeParse(email);

        if(!result.success) {
            setIsEmailValid(false);
            return;
        }

        const finalEmail = result.data;

        setLoading(true);

        try {
            const response = await fetch(`${baseBackendUrl}/forgetpassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: finalEmail
                })
            });
            const output = await response.json();

            if(response.status === StatusCodes.LENGTH_REQUIRED) {
                const faults = output as LengthRequiredType;

                faults.issues.map(issue => {
                    generateToastDefault(issue.message, "error");
                })

            } else if (response.status === StatusCodes.UNAUTHORIZED) {
                const faults = output as BaseResponseType;

                generateToastDefault(faults.msg)
            }
            setForgetPasswordLinkSent(true);
        } catch(error) {
            alert("Something up with the server");
        } finally {
            setLoading(false);
        }

    }, []);

    return (
        <div className="rounded-lg border text-card-foreground shadow-sm w-full max-w-md bg-card/70 backdrop-blur-lg border-muted-border p-6 flex flex-col gap-y-6">
        {          
            <div className={`${otpSent ? "hidden" : ""}`}>
                <div className="flex flex-col space-y-2 text-center">
                    <div className="font-semibold tracking-tight font-headline text-2xl">Welcome to PDF AI</div>
                    <div className="text-sm text-muted-foreground">Your AI-powered assistant.</div>
                </div>

                <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-4">
                        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isEmailInvalid ? "text-white" : "text-red-400"}`} htmlFor="email">Enter Email</label>
                        <Input onChange={() => {
                            if(!isEmailInvalid) {
                                setIsEmailValid(true);
                            }
                        }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="email" ref={emailRef} type="text" placeholder="Enter your email" />
                    </div>
                    { !forgetPassword && !withOtp &&
                        <div className="flex flex-col gap-4">
                            <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isPasswordValid ? "text-white" : "text-red-400"}`} htmlFor="password">Enter Password</label>
                            <Input onChange={() => {
                                if(!isPasswordValid) {
                                    setIsPasswordValid(true);
                                }
                            }} id="password" ref={passwordRef} type="password" placeholder="**********" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
                        </div>
                    }

                    {!forgetPassword && <div className="flex flex-row justify-between gap-x-2">
                        <button onClick={() => setForgetPassword(true)} className="cursor-pointer underline" >Forget Password</button>
                        <button onClick={() => setWithOtp(!withOtp)} className="cursor-pointer underline">Login with {!withOtp ? "otp" : "Password"}</button>
                    </div>}

                    {forgetPasswordLinkSent && 
                        
                        <div className="text-base font-medium text-teal-500">
                            Link Sent to the {emailRef.current?.value ?? ""}
                        </div>
                    }

                    <div onClick={() => {
                        if(forgetPassword) {
                            passwordResetLink();
                            return
                        }
                        sendLoginRequest();
                    }} className="flex flex-row justify-center py-2 bg-blue-500 text-white/90 cursor-pointer hover:bg-blue-600 rounded-md mb-2">
                        {!loading && <button className="cursor-pointer font-medium">{withOtp ? "Get code" : forgetPassword ? "Get Password Reset Link" : "Login"}</button>}
                        {loading && <Loading/>}
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-1 justify-center">
                        <button>First Time?</button>
                        <button className="cursor-pointer font-medium" onClick={() => navigate("/register", {
                            replace: true
                        })}>Register</button>
                    </div>
                </div>
            </div>
        }

        {otpSent && emailRef.current && <OTP email={emailRef.current.value} sendLoginRequest={sendLoginRequest} />}

        </div>
    )
}