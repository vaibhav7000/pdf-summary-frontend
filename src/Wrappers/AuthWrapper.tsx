import { Outlet } from "react-router";

export default function AuthWrapper() {

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background ">
            <Outlet/>
        </div>
    )
}