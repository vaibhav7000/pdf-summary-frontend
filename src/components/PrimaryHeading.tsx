import React, { HTMLAttributes } from "react";
import merge from "../utils/tailwind-merge";


interface PrimaryHeadingProps extends HTMLAttributes<HTMLDivElement>, React.PropsWithChildren {
    title?: string;
}


const PrimaryHeading = (props: PrimaryHeadingProps): React.JSX.Element => {
    const {title, className, children} = props;

    return (
        <div className={`${merge('font-semibold text-2xl tracking-wide md:text-3xl lg:text-3xl', className)}`}>
            {title}
            {children}
        </div>
    )
}

export default PrimaryHeading;