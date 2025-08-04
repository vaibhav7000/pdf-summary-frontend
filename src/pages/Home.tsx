import { useOutletContext } from "react-router"
import { OutletHomeProps } from "../utils/types/types"
import { useAtom, useAtomValue } from "jotai";
import pdfAtom from "../store/pdfStore";
import userAtom from "../store/userStore";

export default function Home() {
    const {valid} = useOutletContext<OutletHomeProps>();
    const [user, setUser] = useAtom(userAtom);
    const [pdf, setPdf] = useAtom(pdfAtom);

    return (
        <div>
            Home
        </div>
    )
}