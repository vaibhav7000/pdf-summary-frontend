import { useOutletContext } from "react-router"
import { OutletHomeProps } from "../utils/types/types"
import { useEffect, useState } from "react";
import Form from "../components/Form";
import SideBar from "../components/SideBar";
import ReactMarkdown from 'react-markdown';

export default function Home() {
    const { valid } = useOutletContext<OutletHomeProps>();


    const [response, setResponse] = useState<string>("");
    const [text, setText] = useState<string>("");

    const [cursor, setCursor] = useState<boolean>(false);

    // const resposneRef = useRef<HTMLDivElement>(null);

    useEffect(function () {
        let timeout: NodeJS.Timeout;
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
        <div className="h-full w-full flex flex-row justify-between pr-24 items-center">
            {/* {valid && <SideBar/>} */}
            <div className="w-full flex flex-col justify-start items-center basis-3/4 self-start pl-10 gap-y-6">
                <Form setResponse={setResponse} valid={valid} setCursor={setCursor} />

                <div className="flex flex-row self-start">
                    {cursor && <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></span>}
                    {response &&
                        <div>
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