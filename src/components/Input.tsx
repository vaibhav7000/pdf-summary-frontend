import React, { forwardRef, HTMLAttributes, InputHTMLAttributes, memo } from "react";
import merge from "../utils/tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    Icon?: React.JSX.Element;
    containerProps?: HTMLAttributes<HTMLDivElement>
}



const Input = memo(forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {className, containerProps, Icon} = props;
    return (
        <div className={`${merge("relative", containerProps?.className)}`}>
            <input ref={ref} id={props.id} type={props.type} placeholder={props.placeholder} className={merge("", className)} onChange={props.onChange} onKeyDown={props.onKeyDown} disabled={props.disabled} maxLength={props.maxLength} />

            {Icon}
        </div>
    )
}))

export default Input;