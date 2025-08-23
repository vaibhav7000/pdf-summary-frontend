import { useOutletContext } from "react-router"
import { OutletHomeProps } from "../utils/types/types"
import { useEffect, useState } from "react";
import Form from "../components/Form";
import ReactMarkdown from 'react-markdown';
import { useLocation } from "react-router";

export default function Home() {
    const { valid } = useOutletContext<OutletHomeProps>();


    const [text, setText] = useState<string>("");

    const [cursor, setCursor] = useState<boolean>(false);
    let oldSummaries: string = useLocation().state;
    const [response, setResponse] = useState<string>("");

    // const resposneRef = useRef<HTMLDivElement>(null);

    useEffect(function () {
        let timeout: NodeJS.Timeout;

        // if(oldSummaries) {
        //     setResponse(oldSummaries);
        // }

        if(!response) {
            return;
        }

        if (text !== response) {
            timeout = setTimeout(function () {
                setText(prev => response.slice(0, prev.length + 1));
            }, 30);
        }

        () => {
            clearTimeout(timeout);
        }
    }, [text, response]);


    return (
        <div className="h-full w-full flex flex-row justify-between items-center pt-[104px]">
            <div className="w-3/4 flex flex-col justify-start items-center mx-auto self-start gap-y-6">
                <Form setResponse={setResponse} valid={valid} setCursor={setCursor} />

                <div className="flex flex-row self-start">
                    {cursor && <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></span>}
                    {response &&
                        <div className="text-white">
                            <ReactMarkdown>
                                {text}
                            </ReactMarkdown>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}