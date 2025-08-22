import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Error from "../components/Error";
import AppBar from "../components/AppBar";


export default function ApplicationWrapper() {
    // custom hook
    const { loading, error, valid } = useAuth();

    return (
        <div className="bg-background min-h-screen w-screen font-arimo pb-10">
            {loading &&
                <div className="h-screen w-screen">
                    <Loading />
                </div>
            }

            {!loading && error && <Error />}

            {!loading && !error &&
                <div>
                    <AppBar valid={valid} />
                    <Outlet context={{
                        valid
                    }} />
                </div>
            }
        </div>



    )
}

