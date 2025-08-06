import React, { useCallback } from "react";
import pdfAtom, { Pdf } from "../store/pdfStore";
import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { StatusCodes } from "http-status-codes";
import { baseBackendUrl } from "../utils/constants";
import { useAtom, useAtomValue } from "jotai";
import userAtom from "../store/userStore";
import { LoginPayload } from "../pages/Login";

export default function Summary({ pdf, index, id }: { pdf: Pdf, index: number, id: number }) {
    const user = useAtomValue(userAtom);
    const [pdfs, setPdfs] = useAtom(pdfAtom);

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

            return response

        } catch (error) {
            throw error;
        }
    }, []);

    return (
        <Wrapper>
            <div className="font-arimo font-2xl font-semibold">
                Promot {index + 1}
            </div>

            <div className="line-clamp-2 font-medium font-arimo text-lg">{pdf.search}</div>

            <div className="flex flex-row justify-between h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2 ">
                <button className=" group cursor-pointer rounded-sm px-3 py-1.5 text-md font-medium transition-all hover:bg-background hover:text-foreground hover:shadow-sm font-arimo flex justify-center gap-x-2 duration-200" onClick={async () => {
                    try {
                        let response = await fetch(pdf.link);
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
                            response = await fetch(output.newUrl);
                        }

                        const blob = await response.blob();

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

                <button className="cursor-pointer rounded-sm px-3 py-1.5 text-md font-medium transition-all hover:bg-background hover:text-foreground hover:shadow-sm font-arimo flex justify-center">Get Summary</button>
            </div>
        </Wrapper>
    )
}


function Wrapper({ children }: React.PropsWithChildren) {

    return (
        <div className="rounded-lg border text-card-foreground shadow-sm w-full max-w-md bg-card/70 backdrop-blur-lg border-muted-border p-6 flex flex-col gap-y-4">
            {children}
        </div>
    )
}
