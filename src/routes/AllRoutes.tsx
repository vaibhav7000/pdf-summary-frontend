import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ApplicationWrapper from "../Wrappers/ApplicationWrapper";


export default function AllRoutes() {

    return (
        <Routes>
            <Route path="register" element={<Register/>} />
            <Route path="login" element={<Login/>} />

            <Route path="" element={<ApplicationWrapper/>}>
                <Route index element={<Home/>} />
            </Route>
        </Routes>
    )
}

/*

    Thinks of AllRoutes as a wrapper for all the routes present in it and when we go to different routes each route will again run the wrapper

*/