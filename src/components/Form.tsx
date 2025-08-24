import React, { useRef, useCallback, FormEvent, useState, useEffect } from "react";
import Input from "./Input";
import { baseBackendUrl } from "../utils/constants";
import { useAtomValue } from "jotai";
import userAtom from "../store/userStore";
import { useNavigate } from "react-router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { StatusCodes } from "http-status-codes";
import { LoginPayload } from "../pages/Login";
import { toast } from "react-toastify";
import generateToastDefault from "../utils/toasts";
import PrimaryHeading from "./PrimaryHeading";
import WrapperIcon from "./IconWrapper";
import Button from "./Button";

type FormProps = {
    valid: boolean;
    setResponse: React.Dispatch<React.SetStateAction<string>>;
    setCursor: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = React.memo(function({valid, setResponse, setCursor}: FormProps) {

    const searchRef = useRef<HTMLInputElement>(null);
    const filesRef = useRef<HTMLInputElement>(null);


    const user = useAtomValue(userAtom);
    const [filename, setFilename] = useState<string>("");

    const naviagte = useNavigate();

    const getSummary: (event: React.FormEvent<HTMLFormElement>) => void = useCallback(async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!valid) {
            naviagte("login");
            return
        }


        try {
            const formData: FormData = new FormData();


            if(!searchRef.current?.value) {
                return;
            }

            if(!filesRef.current) {
                return;
            }

            if(!filesRef.current.files) {
                return;
            }
            // formData.append("search", searchRef.current.value);
            formData.append("search", searchRef.current.value);
            formData.append("files", filesRef.current.files[0]);
            setCursor(true);
            const response = await fetch(`${baseBackendUrl}/summary/pdf`, {
                method: "POST",
                headers: {
                    "Authorization": user["token"]!
                },
                body: formData
            })

            const output = await response.json() as LoginPayload;
            setCursor(false);
            if(response.status === StatusCodes.UNAUTHORIZED) {
                toast.error(output.msg);
                return;
            }

            if(response.status === StatusCodes.LENGTH_REQUIRED) {
                output.issues?.map(issue => {
                    generateToastDefault(issue.message)
                })
                return;
            }

            if(response.status === StatusCodes.BAD_REQUEST) {
                generateToastDefault(output.msg);
                return
            }


            setResponse(output.summary);
        } catch (error) {
            console.log(error)
        }

        setCursor(false);
    }, [valid]);

    useEffect(function() {
        searchRef.current?.focus();
    }, []);

    return (
        <form  className="flex flex-col gap-y-6 w-full grow-2 px-6 py-6 rounded-lg text-card-foreground shadow-sm bg-card backdrop-blur-lg border border-slate-700/50" onSubmit={getSummary}>
            <Wrapper>
                <PrimaryHeading className="font-semibold font-headline text-2xl text-white">PDF AI</PrimaryHeading>
                <PrimaryHeading className="sm:text-base md:text-xl lg:text-xl xl:text-xl text-white/70 mt-0.5">Topic pdf get the Summary</PrimaryHeading>
            </Wrapper>

            <Wrapper>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/60" htmlFor="search">Search</label>
                <Input ref={searchRef} id="search" type="text" placeholder="eg. Simplify this pdf in simple words" className="flex w-full rounded-md border border-input bg-background px-4 py-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white placeholder:text-lg placeholder:tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" Icon={<WrapperIcon Icon={MagnifyingGlassIcon} propsIcon={{
                    className: "w-4 h-4 absolute top-[35%] right-4 "
                }} />} />
            </Wrapper>

            <Wrapper>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/60" htmlFor="files">Attach Files</label>
                {filename && <div className="text-white/80" >{filename}</div>}
                <Input id="files" type="file" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hidden" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if(!event.target || !event.target.files) {
                        return;
                    }

                    setFilename(event.target.files[0].name);
                }} ref={filesRef} />
            </Wrapper>

            <div className="flex flex-row justify-between">
                <button className="bg-blue-400 rounded-lg px-4 py-2 text-white/90 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200" onClick={() => {
                    if(!valid) {
                        naviagte("/login");
                        return
                    }
                    naviagte("/allsummary");

                }} type="button">All Summaries</button>

                <Button className="bg-blue-400 rounded-lg px-4 py-2 text-white/90 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200" typeof="">Get Summary</Button>
            </div>
        </form>
    )
});

export default Form;

function Wrapper({children}: React.PropsWithChildren<{}>) {

    return (
        <div className="flex flex-col gap-y-2">
            {children}
        </div>
    )
}