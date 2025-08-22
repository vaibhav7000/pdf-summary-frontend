import React, { useCallback, useState } from "react";
import pdfAtom, { Pdf } from "../store/pdfStore";
import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { StatusCodes } from "http-status-codes";
import { baseBackendUrl } from "../utils/constants";
import { useAtom, useAtomValue } from "jotai";
import userAtom from "../store/userStore";
import { LoginPayload } from "../pages/Login";
import { toast } from "react-toastify";
import { replace, useNavigate } from "react-router";
import Loading from "./Loading";

export default function Summary({ pdf, index, id }: { pdf: Pdf, index: number, id: number }) {
    const user = useAtomValue(userAtom);
    const [pdfs, setPdfs] = useAtom(pdfAtom);

    const [loading, setLoading] = useState<boolean>(false);
    const naviagte = useNavigate();

    const getNewPdfUrl = useCallback(async function (): Promise<Response> {
        const apiUrl: string = `${baseBackendUrl}/summary/download/${id}`;
        const token = user.token;

        if (!token) {
            throw new Error();
        }

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "authorization": token
                }
            })

            return response;

        } catch (error) {
            throw error;
        }
    }, []);

    const getOnlySummary = useCallback(async (): Promise<void> => {
        const apiUrl: string = `${baseBackendUrl}/summary/pdfid/${id}`;

        let token: string = ""
        if(!user.token) {
            return;
        }

        token = user.token;
        setLoading(true);
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers : {
                    "authorization": token
                }
            });

            const output = await response.json() as LoginPayload;

            if(response.status === StatusCodes.LENGTH_REQUIRED){
                output.issues?.map(issue => toast.error(issue.message));
                if(output.msg) {
                    toast.error(output.msg);
                }
                return;
            }

            if(response.status === StatusCodes.NOT_FOUND) {
                toast.error(output.msg);
                return;
            }

            if(response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
                toast.error("Something up with the backend");
                return;
            }

            setLoading(false);

            naviagte("/", {
                state: output.summary,
                replace: true
            })


        } catch (error) {
            toast.error("Something up with the backend Try again later");
        }
    }, []);

    return (
        <Wrapper>
            <div className="font-arimo font-2xl font-semibold">
                Promot {index + 1}
            </div>

            <div className="line-clamp-1 hover:line-clamp-none transition-all duration-400 cursor-pointer ease-in font-medium font-arimo text-lg">{pdf.search}</div>

            <div className="flex flex-row justify-between h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2 ">
                <button className=" group cursor-pointer rounded-sm px-3 py-1.5 text-md font-medium transition-all hover:bg-background hover:text-foreground hover:shadow-sm font-arimo flex justify-center gap-x-2 duration-200" onClick={async () => {
                    try {
                        const response = await fetch(pdf.link);
                        let newUrl: string = "";
                        if (response.status !== StatusCodes.OK) {
                            const newResponse = await getNewPdfUrl();

                            const output = await newResponse.json() as LoginPayload;

                            if (!output.newUrl) {
                                throw new Error();
                            }
                            if (!pdfs) {
                                throw new Error();
                            }
                            const newPdfs = pdfs.map(pdf => {
                                return {
                                    ...pdf,
                                    link: pdf.id === id ? output.newUrl! : pdf.link
                                }
                            })

                            setPdfs(newPdfs);
                            newUrl = output.newUrl;
                            console.log(newUrl);
                        }
                        let newResponse: Response = response;
                        
                        if(newUrl) {
                            newResponse = await fetch(newUrl);
                        }

                        const blob = await newResponse.blob();

                        const downloadUrl = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = downloadUrl
                        a.download = 'myfile.pdf'
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        window.URL.revokeObjectURL(downloadUrl);

                    } catch (error) {
                        console.log(error);
                    }
                }}>
                    <div className=""><DocumentIcon className="size-6 hover:color-white" /></div>
                </button>

                <button className="cursor-pointer rounded-sm px-3 py-1.5 text-md font-medium transition-all hover:bg-background hover:text-foreground hover:shadow-sm font-arimo flex justify-center">{loading ? <Loading/> : <div onClick={getOnlySummary}>Get Summary</div>}</button>
            </div>
        </Wrapper>
    )
}


function Wrapper({ children }: React.PropsWithChildren) {

    return (
        <div className="rounded-lg border text-card-foreground shadow-sm basis-1/3  bg-card/70 backdrop-blur-lg border-muted-border p-6 flex flex-col gap-y-4">
            {children}
        </div>
    )
}
