import { atom } from "jotai";

interface Pdf {
    search: string;
    link: string;
    id: number;
}

const pdfAtom = atom<Pdf[] | null>(null);

export default pdfAtom;

export {
    Pdf
}