import React from "react";

interface CardWrapperProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
    
};

const CardWrapper = (props: CardWrapperProps) => {
    return (
        <div className="rounded-lg border text-card-foreground shadow-sm w-full max-w-md bg-card/70 backdrop-blur-lg border-muted-border p-6 flex flex-col gap-y-6">
            {props.children}
        </div>
    )
}


export default CardWrapper;