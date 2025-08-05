import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <div>
            <input ref={ref} id={props.id} type={props.type} placeholder={props.placeholder} className={props.className} onChange={props.onChange} />
        </div>
    )
})

export default Input;