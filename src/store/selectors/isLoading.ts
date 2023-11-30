import { selector } from "recoil";
import { userState } from "../atoms/userState";
import { allCoursesState } from "../atoms/allCoursesState";
import { singleCourseState } from "../atoms/singleCourseState";


export const isUserLoadingState = selector({
    key: "isLoadingState",
    get: ({ get }) => {
        const state = get(userState);
        return state.isUserLoading;
    }
});

export const isAllCoursesLoadingState = selector({
    key: "isAllCoursesLoadingState",
    get: ({ get }) => {
        const state = get(allCoursesState);
        return state.isCoursesLoading;
    }
});

export const isSingleCourseLoadingState = selector({
    key  :"isSingleCourseLoadingState",
    get : ({get})=>{
        const state = get(singleCourseState);
        return state.isCourseLoading;
    }
})