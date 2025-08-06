import { useAtom, useAtomValue } from "jotai"
import { Link, useNavigate } from "react-router"
import userAtom from "../store/userStore"
import { useEffect, useState } from "react";

export default function AppBar({ valid }: { valid: boolean }) {

    const [user, setUserAtom] = useAtom(userAtom);
    const [logout, setLogout] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(function() {
        let timeout: NodeJS.Timeout;
        if(logout) {
            timeout = setTimeout(function() {
                setLogout(false);
            }, 10 * 1000);
        }

        return () => clearTimeout(timeout);
    }, [logout]);

    return (
        <>
            {valid &&
                <div className="fixed top-0 h-[90px] w-full">
                    <div className="w-3/4 mx-auto flex items-center h-full justify-between">
                        <Link className="font-bold text-2xl text-white hover:text-muted-foreground" to="/">
                            Ask AI
                        </Link>

                        <div className="cursor-pointer" onClick={() => setLogout(true)}>
                            {!logout && user.firstname && user.lastname && <Logo fLetter={user.firstname.slice(0, 1)} lLetter={user.lastname.slice(0, 1)} />}
                        </div>

                        {logout && <button onClick={() => {
                            setUserAtom({
                                token: null,
                                firstname: null,
                                lastname: null
                            })

                            navigate("/", {
                                replace: true
                            })
                        }} className={`text-white font-medium text-xl cursor-pointer`}>Logout</button>}

                    </div>
                </div>
            }
        </>
    )
}

function Logo({fLetter, lLetter}: {fLetter: string; lLetter: string}) {

    return (
        <div className="flex flex-row px-2 py-2 bg-white text-black rounded-full uppercase text-base font-medium">
            {fLetter}{lLetter}
        </div>
    )
}