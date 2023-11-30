import { atom } from "recoil";

interface UserState {
    isUserLoading: boolean,
    username: string | null,
}

export const userState = atom<UserState>({
    key: "userState",
    default: {
        isUserLoading: true,
        username: null
    }
});