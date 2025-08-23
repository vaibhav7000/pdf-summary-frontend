import { useCallback, useRef, useState } from "react"
import Input from "../components/Input"
import CardWrapper from "../Wrappers/CardWrapper"
import generateToastDefault from "../utils/toasts";
import { registerSchema } from "../utils/zod/zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { baseBackendUrl } from "../utils/constants";
import OTP from "../components/OTP";
import { StatusCodes } from "http-status-codes";
import { BaseResponseType, ConflictType, LengthRequiredType } from "../utils/types/types";


export default function Register() {

    const firstnameRef = useRef<HTMLInputElement>(null);
    const lastnameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setConfirmPassword] = useState<boolean>(false);

    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const sendOTPRegister = useCallback(async () => {

        if (!firstnameRef.current || !lastnameRef.current || !emailRef.current || !passwordRef.current || !confirmPasswordRef.current) {
            generateToastDefault("Something up with the frontend", "info");
            return;
        }


        const firstname = firstnameRef.current.value;
        const lastname = lastnameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value
        const confirm = confirmPasswordRef.current.value;


        const result = registerSchema.safeParse({
            firstname,
            lastname, email, password, confirm
        })

        if (!result.success) {
            result.error.issues.forEach(issue => generateToastDefault(issue.message, "error"));
            return;
        }


        try {
            const response = await fetch(`${baseBackendUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstname,lastname,email, password, confirm
                })
            });

            const status = response.status;
            const output = await response.json();

            if(status === StatusCodes.INTERNAL_SERVER_ERROR) {
                generateToastDefault("Something up with the backend");
                return;
            }

            if(status === StatusCodes.LENGTH_REQUIRED) {
                const final = output as LengthRequiredType;
                final.issues.forEach(issue => generateToastDefault(issue.message, "error"));
                return;
            }

            if(status === StatusCodes.CONFLICT) {
                const final = output as ConflictType;
                generateToastDefault(final.msg, "error");
                return
            }

            const final = output as BaseResponseType;

            generateToastDefault(final.msg, "success");

            setOtpSent(true);
        } catch (error) {
            console.log(error);
            generateToastDefault("Something up with the backend")
        } finally {
            setLoading(false);
        }

    }, []);


    return (
        <CardWrapper>
            {<div className={`flex flex-col gap-y-4 items-center ${otpSent ? "hidden" : ""}`}>
                <div className="text-2xl font-medium">Register</div>

                <div className="flex flex-col gap-y-2.5 self-stretch">
                    <label htmlFor="firstname">Enter Firstname</label>
                    <Input onChange={() => {
                        // if(!isEmailInvalid) {
                        // setIsEmailValid(true);
                        // }
                    }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="firstname" ref={firstnameRef} type="text" placeholder="Enter your firstname" />
                </div>

                <div className="flex flex-col gap-y-2.5 self-stretch">
                    <label htmlFor="lastname">Enter Lastname</label>
                    <Input onChange={() => {
                        // if(!isEmailInvalid) {
                        // setIsEmailValid(true);
                        // }
                    }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="lastname" ref={lastnameRef} type="text" placeholder="Enter your lastname" />
                </div>

                <div className="flex flex-col gap-y-2.5 self-stretch">
                    <label htmlFor="email">Enter Email</label>
                    <div className="relative">
                        <Input onChange={() => {
                            // if(!isEmailInvalid) {
                            // setIsEmailValid(true);
                            // }
                        }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="email" ref={emailRef} type="text" placeholder="Enter your email" />
                    </div>

                </div>

                <div className="flex flex-col gap-y-2.5 self-stretch">
                    <label htmlFor="password">Password</label>

                    <div className="relative">
                        <Input onChange={() => {
                            // if(!isEmailInvalid) {
                            // setIsEmailValid(true);
                            // }
                        }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="password" ref={passwordRef} type={showPassword ? "text" : "password"} placeholder="*******" />

                        <div className="w-4 h-4 absolute top-2/6 right-4 cursor-pointer" onClick={() => setShowPassword(val => !val)}>
                            {!showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                        </div>

                    </div>
                </div>

                <div className="flex flex-col gap-y-2.5 self-stretch">
                    <label htmlFor="confirm">Confirm Password</label>
                    <div className="relative">
                        <Input onChange={() => {
                            // if(!isEmailInvalid) {
                            // setIsEmailValid(true);
                            // }
                        }} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="confirm" ref={confirmPasswordRef} type={showConfirmPassword ? "text" : "password"} placeholder="*******" />

                        <div className="w-4 h-4 absolute top-2/6 right-4 cursor-pointer" onClick={() => setConfirmPassword(val => !val)}>
                            {!showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                        </div>
                    </div>
                </div>

                <button onClick={sendOTPRegister} className="py-2 text-center self-stretch bg-blue-500 hover:bg-blue-600 cursor-pointer mt-4">
                    Register
                </button>
            </div>}

            { otpSent && <OTP path="register" email={emailRef.current ? emailRef.current.value : ""} sendLoginRequest={sendOTPRegister} />}
        </CardWrapper>
    )
}