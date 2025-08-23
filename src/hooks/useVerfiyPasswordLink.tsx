import { useEffect, useState } from "react"
import { baseBackendUrl } from "../utils/constants";
import { StatusCodes } from "http-status-codes";

const useVerifyPasswordLink = (email: string, token: string) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [valid, setValid] = useState<boolean>(false);


    useEffect(() => {

        if(!email || !token) {
            setLoading(false);
            return;
        }

        async function verifyLink() {
            try {
                console.log(email, token)
                const response = await fetch(`${baseBackendUrl}/resetpassword/${email}/${token}`, {
                    method: "GET"
                });

                if(response.status === StatusCodes.REQUEST_TIMEOUT) {
                    setValid(false);
                } else {
                    setValid(true);
                }
            } catch (error) {
                setError(true)
            } finally {
                setLoading(false);
            }
        }

        verifyLink();
    }, []);

    return {
        loading, error, valid
    }
}

export default useVerifyPasswordLink;