import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ApplicationWrapper from "../Wrappers/ApplicationWrapper";
import AuthWrapper from "../Wrappers/AuthWrapper";
import AllSummaries from "../pages/AllSummaries";


export default function AllRoutes() {

    return (
        <Routes>
            <Route element={<AuthWrapper/>}>
                <Route path="register" index element={<Register/>} />
                <Route path="login" element={<Login/>} />
            </Route>

            <Route path="" element={<ApplicationWrapper/>}>
                <Route index element={<Home/>} />
                <Route path="allsummary" element={<AllSummaries/>} />
            </Route>
        </Routes>
    )
}

/*

    Thinks of AllRoutes as a wrapper for all the routes present in it and when we go to different routes each route will again run the wrapper

*/