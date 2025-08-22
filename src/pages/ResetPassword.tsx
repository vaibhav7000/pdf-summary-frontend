import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import useVerifyPasswordLink from "../hooks/useVerfiyPasswordLink";

const ResetPassword = () => {
    const {token, email} = useParams<{
        token: string,
        email: string;
    }>();

    const navigate = useNavigate();
    const {loading, error, valid} = useVerifyPasswordLink(email ?? "", token ?? "");

    useEffect(() => {

        if(loading) {
            return;
        }

        if(!valid) {
            navigate("/login");
            return
        }

        if(error) {
            navigate("/");
            return;
        }

    }, [loading, error, valid]);


    return (
        <div>
            <div>Reset Password</div>
        </div>
    )
    
}

export default ResetPassword;