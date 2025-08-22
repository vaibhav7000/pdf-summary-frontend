import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ApplicationWrapper from "../Wrappers/ApplicationWrapper";
import AuthWrapper from "../Wrappers/AuthWrapper";
import AllSummaries from "../pages/AllSummaries";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../pages/NotFound";


export default function AllRoutes() {

    return (
        <Routes>
            <Route element={<AuthWrapper/>}>
                <Route path="register" index element={<Register/>} />
                <Route path="login" element={<Login/>} />
                <Route path="resetpassword/:email/:token" element={<ResetPassword />} />
            </Route>

            <Route path="" element={<ApplicationWrapper/>}>
                <Route index element={<Home/>} />
                <Route path="allsummary" element={<AllSummaries/>} />
            </Route>

            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}

/*

    Thinks of AllRoutes as a wrapper for all the routes present in it and when we go to different routes each route will again run the wrapper

*/