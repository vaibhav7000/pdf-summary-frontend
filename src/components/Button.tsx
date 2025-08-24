import React, { ButtonHTMLAttributes, HTMLAttributes } from "react";
import merge from "../utils/tailwind-merge";

interface ButtonProps extends React.PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {

};

const Button = (props: ButtonProps) => {
    const {className, children, onClick, type} = props;

    return (
        <button onClick={onClick} type={type} className={`${merge("bg-blue-500 hover:bg-blue-600 transition-all duration-100 cursor-pointer px-4 py-2", className)}`}>
            {children}
        </button>
    )
}

export default Button;