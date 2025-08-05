import { JSX, useEffect, useState } from "react";


export default function Heading(): JSX.Element {
    const keywords: string[] = ["Summary of PDF", "Know more about your PDF", "Simplify your PDF"];
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [text, setText] = useState<string>("");
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(function() {
        let timeout: NodeJS.Timeout;

        if(!isDeleting && keywords[currentWordIndex] !== text) {
            timeout = setTimeout(function() {
                setText(prev => keywords[currentWordIndex].slice(0, prev.length + 1));
            }, 160);
        } else if (isDeleting) {
            timeout = setTimeout(function() {
                setText(prev => keywords[currentWordIndex].slice(0, prev.length - 1));
            }, 50);
        }

        if(!isDeleting && keywords[currentWordIndex] === text) {
            setTimeout(function() {
                setIsDeleting(true);
            }, 200);
        } else if(isDeleting && text === "") {
            setCurrentWordIndex(prev => (prev + 1) % keywords.length);
            setIsDeleting(false);
        }

        return () => clearTimeout(timeout);

    }, [text, isDeleting, currentWordIndex]);

    return (
        <div className="flex flex-row gap-x-1">
            <div className="text-white text-2xl">{text}</div>
            <span className="border-r-2 border-white"></span>
        </div>
    )
}