import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import { baseBackendUrl } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import { string, ZodError } from "zod";
import OTP from "../components/OTP";
import Loading from "../components/Loading";
import { useSetAtom } from "jotai";
import userAtom from "../store/userStore";

export interface LoginPayload {
    phrase: string;
    msg: string;
    token?: string;
    issues?: ZodError[];
    firstname?: string;
    lastname?: string;
}

export default function Login() {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [withOtp, setWithOtp] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false);

    const [isEmailInvalid, setIsEmailValid] = useState<boolean>(true);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const setUserAtom = useSetAtom(userAtom);

    useEffect(function() {
        emailRef.current?.focus();
    }, []);

    const sendLoginRequest = useCallback(async function() {
        const apiUrl: string = `${baseBackendUrl}/login/${withOtp ? "otp" : "password"}`;

        if(!emailRef.current?.value) {
            setIsEmailValid(false);
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
                setIsPasswordValid(false);
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

            const output = await response.json() as LoginPayload;
            console.log(response);

            setLoading(false)

            if(response.status === StatusCodes.LENGTH_REQUIRED) {
                output.issues?.forEach(err => {
                    console.log(err.message)
                });
            }

            if(response.status === StatusCodes.FORBIDDEN) {
                console.log(output.msg);
                return;
            }

            if(withOtp) {
                setOtpSent(true);
                return;
            }

            let token: string = "";

            if(output.token) {
                token = `Bearer ${output["token"]}`
            }
            setUserAtom({
                token: token,
                firstname: output["firstname"] ?? "",
                lastname: output["lastname"] ?? "",
            });

            navigate("/", {
                replace: true
            })
        } catch (error) {
            
        }
    }, [withOtp]);

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
                        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isEmailInvalid ? "text-white" : "text-red-400"}`} htmlFor="email">Email</label>
                        <Input onChange={() => {
                            if(!isEmailInvalid) {
                                setIsEmailValid(true);
                            }
                        }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="email" ref={emailRef} type="text" placeholder="Enter your email" />
                    </div>
                    { !withOtp &&
                        <div className="flex flex-col gap-4">
                            <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isPasswordValid ? "text-white" : "text-red-400"}`} htmlFor="password">Password</label>
                            <Input onChange={() => {
                                if(!isPasswordValid) {
                                    setIsPasswordValid(true);
                                }
                            }} id="password" ref={passwordRef} type="password" placeholder="**********" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
                        </div>
                    }

                    <div className="flex flex-row justify-between gap-x-2">
                        <button className="cursor-pointer underline" >Forget Password</button>
                        <button onClick={() => setWithOtp(!withOtp)} className="cursor-pointer underline">Login with {!withOtp ? "otp" : "Password"}</button>
                    </div>

                    <div onClick={sendLoginRequest} className="flex flex-row justify-center py-2 bg-blue-500 text-white/90 cursor-pointer hover:bg-blue-600 rounded-md mb-2">
                        {!loading && <button className="cursor-pointer font-medium">{withOtp ? "Get code" : "Login"}</button>}
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