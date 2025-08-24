import React, { SVGAttributes } from "react"

interface WrapperIconProps {
    Icon: React.ComponentType<SVGAttributes<SVGElement>>;
    propsIcon?: React.SVGAttributes<SVGElement>;
}

const WrapperIcon = (props: WrapperIconProps) => {
    const { Icon, propsIcon } = props;

    return (
        <Icon {...propsIcon} />
    )
}


export default WrapperIcon;