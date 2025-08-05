import React, { InputHTMLAttributes, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "./Input";

interface OTPProps {
    email: string;
    sendLoginRequest: () => Promise<void>
}

const OTP = memo(function ({ email, sendLoginRequest }: OTPProps) {

    const allRef: React.RefObject<HTMLInputElement | null>[] = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

    const [timer, setTimer] = useState<number>(60);
    const currentInputFocus = useRef<number>(0);


    useEffect(function() {
        let interval = setInterval(function() {
            if(timer <= 0) {
                clearInterval(interval);
                return;
            }
            setTimer(current => current - 1);
        }, 1000);


        allRef[0].current?.focus();

        return () => clearInterval(interval);
    }, []);

    const onInput = useCallback(function(event: InputHTMLAttributes<HTMLInputElement>) {
        if(currentInputFocus.current < allRef.length - 1) {
            currentInputFocus.current++;
        }
        allRef[currentInputFocus.current].current?.focus();
    }, []);

    const onKeyPress = useCallback(function(event: React.KeyboardEvent<HTMLInputElement>) {
        const key = event.key;
        const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Delete"];

        if(!allowedKeys.includes(key)) {
            event.preventDefault();
            return
        };

        if(key === allowedKeys[allowedKeys.length - 1] || key === allowedKeys[allowedKeys.length - 2]) {
            
            if(currentInputFocus.current > 0) {
                currentInputFocus.current--;
            }
            const ref = allRef[currentInputFocus.current];

            if(ref && ref.current) {
                ref.current.value = "";
                ref.current.focus();
            }

        }

    }, []);
    

    return (
        <div className="flex flex-col items-center gap-y-6">
            <div className="font-semibold tracking-tight font-headline text-xl">OTP Sent on {email}</div>
            <div className="flex flex-row justify-center gap-x-6">
                {allRef.map((singleRef, index) => {
                    return <Input onKeyDown={onKeyPress} maxLength={1} onChange={onInput} key={index} ref={singleRef} className="rounded-full h-8 w-8 bg-white/50 text-center" />
                })}
            </div>

            <div className="flex flex-row gap-x-1">
                <div>Did't get code?</div>
                <button disabled={timer > 0 ? true : false} className="font-medium underline disabled:text-white/50 cursor-pointer">Resend in ({timer}s)</button>
            </div>
        </div>
    )
})

export default OTP;