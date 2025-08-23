import { useCallback, useEffect, useRef } from "react";
import Input from "../components/Input";
import { useNavigate, useParams } from "react-router";
import useVerifyPasswordLink from "../hooks/useVerfiyPasswordLink";
import { changePasswordSchema } from "../utils/zod/zod";
import { baseBackendUrl } from "../utils/constants";
import { StatusCodes } from "http-status-codes";

const ResetPassword = () => {
    const {token, email} = useParams<{
        token: string,
        email: string;
    }>();


    const navigate = useNavigate();
    const {loading, error, valid} = useVerifyPasswordLink(email ?? "", token ?? "");


    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);
    // useEffect(() => {

    //     if(loading) {
    //         return;
    //     }

    //     if(!valid) {
    //         navigate("/login");
    //         return
    //     }

    //     if(error) {
    //         navigate("/");
    //         return;
    //     }

    // }, [loading, error, valid]);

    const changePassword = useCallback(async () => {

        if(!passwordRef.current || !confirmRef.current) {
            alert("Something up with the frontend")
            return;
        }

        const password: string = passwordRef.current.value;
        const confirm: string = confirmRef.current.value;

        const result = changePasswordSchema.safeParse({
            password, confirm
        })

        if(!result.success) {
            console.log(result.error.issues);
            return;
        }

        const finalData = result.data;

        try {
            const response = await fetch(`${baseBackendUrl}/resetpassword/${email}/${token}/changepassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...finalData
                })
            });

            const statusCode = response.status;
            const output = await response.json();
            if(statusCode === StatusCodes.LENGTH_REQUIRED) {
                
                alert("Issue with the parameters");
                console.log()
            } else if(statusCode === StatusCodes.REQUEST_TIMEOUT) {

                alert("Link Expired");
            } else {
                // confirmation done
                alert("Password Successfully changed");
                navigate("/login", {
                    replace: true
                });
            }
        } catch (error) {
            
        }

    }, []);


    return (
        <div>
            {/* show the field to change the password within 5 minutes */}
            {!loading && valid && <div className="rounded-lg border text-card-foreground shadow-sm w-full max-w-md bg-card/70 backdrop-blur-lg border-muted-border p-6 flex flex-col gap-y-6">

            <div>Change Password</div>
                <div className="flex flex-col gap-4">
                        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${ "text-white"}`} htmlFor="password">Password</label>
                        <Input ref={passwordRef} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="password" type="password" placeholder="********" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${ "text-white"}`} htmlFor="confirm">Confirm</label>
                        <Input ref={confirmRef} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="confirm" type="password" placeholder="*********" />
                    </div>

                    <button onClick={changePassword} className="bg-blue-400 ">Change Password</button>
            </div>}

            {!loading && !valid && <div onClick={() => {
                navigate("/login", {
                    replace: true
                })
            }}>
                Link is expired
            </div>}


            {!loading && error && <div>
                Something up with the backend try again later
            </div>}
        </div>
    )
    
}

export default ResetPassword;