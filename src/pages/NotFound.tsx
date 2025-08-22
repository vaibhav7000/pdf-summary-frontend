import { useEffect } from "react"
import { useNavigate } from "react-router";

const NotFound = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");
    }, []);

    return (
        <div>
            Not Found
        </div>
    )
}


export default NotFound;