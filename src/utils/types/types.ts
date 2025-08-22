import { ZodError } from "zod";

interface OutletHomeProps {
    valid: boolean
}

interface BaseResponseType {
    msg: string;
    phrase: string;
}

interface LengthRequiredType extends BaseResponseType {
    issues: ZodError[];
}



export {
    OutletHomeProps, LengthRequiredType, BaseResponseType
}