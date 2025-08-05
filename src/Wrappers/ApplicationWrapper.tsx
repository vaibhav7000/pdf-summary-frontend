import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Error from "../components/Error";


export default function ApplicationWrapper() {
    const { loading, error, valid } = useAuth();
    return (
        <div className="bg-background h-screen w-screen font-arimo pt-[104px]">
            {loading &&
                <Loading />
            }

            {!loading && error && <Error />}

            {!loading && !error &&
                <Outlet context={{
                    valid
                }} />
            }
        </div>



    )
}

