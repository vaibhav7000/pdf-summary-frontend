import { forwardRef, InputHTMLAttributes, memo } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>



const Input = memo(forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <div>
            <input ref={ref} id={props.id} type={props.type} placeholder={props.placeholder} className={props.className} onChange={props.onChange} onKeyDown={props.onKeyDown} disabled={props.disabled} maxLength={props.maxLength} />
        </div>
    )
}))

export default Input;