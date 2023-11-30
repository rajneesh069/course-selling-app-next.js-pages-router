import { selector } from "recoil";
import { allCoursesState } from "../atoms/allCoursesState";
//All courses array is simply selector to get all the courses from courses atom.

export const allCoursesArrayState = selector({
    key: "allCoursesArrayState",
    get: ({ get }) => {
        const state = get(allCoursesState);
        if (state) {
            return state.courses;
        } else {
            return null;
        }
    }
});