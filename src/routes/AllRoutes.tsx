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
                <Route path="register" caseSensitive index element={<Register/>} />
                <Route path="login" caseSensitive element={<Login/>} />
                <Route path="resetpassword/:email/:token" caseSensitive element={<ResetPassword />} />
            </Route>

            <Route path="" element={<ApplicationWrapper/>}>
                <Route index caseSensitive element={<Home/>} />
                <Route path="allsummary" caseSensitive  element={<AllSummaries/>} />
            </Route>

            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}

/*

    Thinks of AllRoutes as a wrapper for all the routes present in it and when we go to different routes each route will again run the wrapper

    "React-router" performs client-side-routing, this enables the react app to dynamically render the component inside the index.html without reloading the page, the component gets re-rendered inside the index.html.

    The page does not gets reloading because we are using the react-router components like Link, NavLink that does not make request to the server rather, instead the URL of the browser search Bar changes and the component get renders inside the root element. This is called client side routing

    Drawbacks of client side routing
    1. If we directly makes the request to the server for a path like /about it will not provide because there is no such path there is only 1 file at the root, => we have to configure that by always providing the base index.html and then decide the react-router to perform for the client side routing

    2. This is what happens when we deployed the app on vercel


    => When deploying the react-router project on the server, we have to configure it such that whenever it gets the it always server the index.html and then client side routing came into the picture
    
    

*/