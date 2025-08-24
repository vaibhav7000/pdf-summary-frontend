import clsx, {ClassValue} from "clsx";
import { twMerge } from "tailwind-merge";


const merge = (...values: ClassValue[]): string => {
    return twMerge(clsx(values));
}


export default merge;