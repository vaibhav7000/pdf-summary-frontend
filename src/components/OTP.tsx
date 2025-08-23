import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Input from "./Input";
import Loading from "./Loading";
import { baseBackendUrl } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import { useSetAtom } from "jotai";
import userAtom from "../store/userStore";
import { useNavigate } from "react-router";
import generateToastDefault from "../utils/toasts";
import { LengthRequiredType, LoginPayloadType, RequestTimeoutType } from "../utils/types/types";

interface OTPProps {
    email: string;
    sendLoginRequest: () => Promise<void>
}

const OTP = memo(function ({ email, sendLoginRequest }: OTPProps) {

    const allRef: React.RefObject<HTMLInputElement | null>[] = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

    const [timer, setTimer] = useState<number>(60);
    const currentFocusIndex = useRef<number>(0);

    const [fullOtp, setFullOtp] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const setUserAtom = useSetAtom(userAtom);

    const navigate = useNavigate();

    useEffect(function () {
        let timeout = setTimeout(function () {
            if (timer <= 0) {
                return
            }
            setTimer(prev => prev - 1);
        }, 1000 * 1);

        return () => {
            clearTimeout(timeout);
        }
    }, [timer]);

    useEffect(function () {
        const current = allRef[0].current;
        if (current) {
            current.disabled = false;
            current?.focus();
        }
    }, []);

    const resendOTP = useCallback(async function () {
        await sendLoginRequest();
        setTimer(60);
    }, []);

    const onInput = useCallback(function (event: React.ChangeEvent<HTMLInputElement>) {
        if (currentFocusIndex.current < allRef.length - 1) {
            const prev = allRef[currentFocusIndex.current].current;

            if (prev) {
                prev.disabled = true;;
            }
            currentFocusIndex.current++;
            const newRef = allRef[currentFocusIndex.current].current;

            if (newRef) {
                newRef.disabled = false;
            }

            allRef[currentFocusIndex.current].current?.focus();
        } if (currentFocusIndex.current === allRef.length - 1 && allRef[currentFocusIndex.current].current?.value) {
            setFullOtp(true);
        }
    }, []);

    const onKeyPress = useCallback(function (event: React.KeyboardEvent<HTMLInputElement>) {
        const key: string = event.key;

        if (key === "Backspace" || key === "Delete") {
            setFullOtp(false);
            event.preventDefault();
            const ref = allRef[currentFocusIndex.current]

            if ((ref.current?.value && currentFocusIndex.current === allRef.length - 1) || (currentFocusIndex.current === 0)) {
                if (ref.current) {
                    ref.current.value = "";
                }
                return;
            }

            const prev = allRef[currentFocusIndex.current].current;
            if (prev) {
                prev.disabled = true;
            }
            currentFocusIndex.current--;

            const newRef = allRef[currentFocusIndex.current].current;


            if (newRef) {
                newRef.value = "";
                newRef.disabled = false;
                newRef.focus();
            }
            return
        }

        if (!/^\d$/.test(key)) {
            event.preventDefault();
        }
    }, []);

    const verifyOTP = useCallback(async function () {
        let otpString: string = "";

        allRef.forEach(ref => {
            otpString = `${otpString}${ref.current?.value}`;
        })

        const otp = parseInt(otpString);

        if (!otp) {
            generateToastDefault("Invalid OTP", "error");
            return;
        }

        setLoading(true);
        try {
            const api: string = `${baseBackendUrl}/login/verifyotp`;
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp
                })
            });

            setLoading(false);
            const output = await response.json();
            const status = response.status;

            if (status === StatusCodes.LENGTH_REQUIRED) {
                const final = output as LengthRequiredType;
                final.issues.forEach(issue => generateToastDefault(issue.message));
                return
            }

            if (status === StatusCodes.REQUEST_TIMEOUT) {
                const final = output as RequestTimeoutType
                generateToastDefault(final.msg, "error");
                return;
            }

            if (status === StatusCodes.CONFLICT) {
                const final = output as RequestTimeoutType
                generateToastDefault(final.msg, "error");
                return;
            }

            const final = output as LoginPayloadType;

            let token: string = "";

            if (final.token) {
                token = `Bearer ${output["token"]}`
            }

            generateToastDefault(final.msg);

            setUserAtom({
                token,
                firstname: final["firstname"] ?? "",
                lastname: final["lastname"] ?? "",
            });

            navigate("/", {
                replace: true
            })

        } catch (error) {
            generateToastDefault("Something up with the backend")
        }

    }, []);




    return (
        <div className="flex flex-col items-center gap-y-6">
            <div className="font-semibold tracking-tight font-headline text-xl">OTP Sent on {email}</div>
            <div className="flex flex-row justify-center gap-x-6">
                {allRef.map((singleRef, index) => {
                    return <Input disabled={true} onKeyDown={onKeyPress} maxLength={1} onChange={onInput} key={index} ref={singleRef} className="rounded-full h-8 w-8 bg-white/50 text-center" />
                })}
            </div>

            <button disabled={!fullOtp} onClick={verifyOTP} className="self-stretch py-2 bg-blue-500 text-white/90 cursor-pointer hover:bg-blue-600 rounded-md mb-2 disabled:bg-gray-400 ">{loading ? <Loading /> : "Verify"}</button>

            <div className="flex flex-row gap-x-2">
                <div>Did't get code?</div>
                <button disabled={timer > 0 ? true : false} onClick={resendOTP} className="font-medium underline disabled:text-white/50 cursor-pointer">Resend ({timer}s)</button>
            </div>

        </div>
    )
})

export default OTP;