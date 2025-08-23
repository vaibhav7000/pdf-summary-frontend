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

interface ForbiddenType extends BaseResponseType {

};

interface LoginPayloadType extends BaseResponseType {
    firstname: string;
    lastname: string;
    token: string;
}

interface RequestTimeoutType extends BaseResponseType {

}

interface ConflictType extends BaseResponseType {

}

interface CustomError extends Error {
    msg: string;
    phrase: string;
}

export {
    OutletHomeProps, LengthRequiredType, BaseResponseType, ForbiddenType, LoginPayloadType, RequestTimeoutType, ConflictType, CustomError
}