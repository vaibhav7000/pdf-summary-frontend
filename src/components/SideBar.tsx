import { useAtomValue } from "jotai"
import pdfAtom from "../store/pdfStore"
import { memo } from "react";


const SideBar = memo(function SideBar() {

    const pdfs = useAtomValue(pdfAtom);

    console.log(pdfs);

    return (
        <div className="basis-1/5 h-full">
            {pdfs &&
                pdfs.map(pdf => {
                    return (
                        <div key={pdf.id}>
                            {pdf.search};
                        </div>
                    )
                })
            }
        </div>
    )
})

export default SideBar;