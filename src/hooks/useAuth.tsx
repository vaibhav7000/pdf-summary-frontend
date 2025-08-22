import { use, useEffect, useState } from "react";
import { baseBackendUrl } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import pdfAtom, { Pdf } from "../store/pdfStore";
import userAtom from "../store/userStore";

interface UseAuthReturn {
    loading: boolean;
    valid: boolean;
    error: boolean;
}

function useAuth(): UseAuthReturn {
    const [loading, setLoading] = useState<boolean>(true);
    const [valid, setValid] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const setPdfAtom = useSetAtom(pdfAtom);
    const user = useAtomValue(userAtom);


    useEffect(function() {
        async function verifyUser() {
            const api: string = `${baseBackendUrl}/summary/all`;
            if(!user.token) {
                setValid(false);
                setLoading(false);
                setError(false);
                return;
            }
            

            try {
                const response = await fetch(api, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": user.token
                    },
                }) 
                
                setLoading(false);

                if(response.status === StatusCodes.UNAUTHORIZED) {
                    return
                }



                const output: {
                    phrase: string;
                    pdfs: Pdf[]
                } = await response.json();

                setPdfAtom(output["pdfs"]);
                setValid(true);
                setError(false);
            } catch (error) {
                console.log(error)
                setError(true);
                setLoading(false);
                setValid(false);
            }
        }

        verifyUser();
    }, [user])

    return {loading, valid, error}
}

export default useAuth;