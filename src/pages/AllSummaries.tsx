import { useAtomValue } from "jotai";
import pdfAtom from "../store/pdfStore";
import { JSX, useEffect } from "react";
import { OutletHomeProps } from "../utils/types/types";
import { useNavigate, useOutletContext } from "react-router";
import Summary from "../components/Summary";

export default function AllSummaries(): JSX.Element {
    const pdfs = useAtomValue(pdfAtom);
    const {valid}: OutletHomeProps = useOutletContext<OutletHomeProps>();
    const navigate = useNavigate();


    useEffect(function() {
        if(!valid) {
            navigate("/login", {
                replace: true
            })
            return
        }

        navigate("/allsummary", {
            replace: true
        })
    }, [valid]);
    
    return (
        <>
            {valid && 
                <div className="flex flex-row gap-x-10 gap-y-10 flex-wrap w-[90%] mx-auto pt-[104px]">
                    {pdfs && pdfs.map((pdf, index) => <Summary index={index} id={pdf.id} key={pdf.id} pdf={pdf}/>)}
                </div>
            }
        </>
    )
}