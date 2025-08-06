import { atomWithStorage } from "jotai/utils";

interface UserStorage {
    token: string | null;
    firstname: string | null;
    lastname: string | null;
}

const userAtom = atomWithStorage<UserStorage>("client", {
    token: "",
    firstname: null,
    lastname: null
}, {
    getItem: (key, intialValue) => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) as UserStorage : intialValue
    },
    setItem: (key, newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue));
    },
    removeItem: (key) => localStorage.removeItem(key)
}, {
    getOnInit: true
})

export default userAtom;