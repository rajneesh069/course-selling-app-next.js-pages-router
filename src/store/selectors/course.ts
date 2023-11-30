import { selector } from "recoil";
import { singleCourseState } from "../atoms/singleCourseState";


export const courseDescriptionState = selector({
    key: "courseDescriptionState",
    get: ({ get }) => {
        const state = get(singleCourseState);
        if (state.course) {
            return state.course.description
        } else {
            return null
        }
    }
});

export const courseTitleState = selector({
    key: "courseTitleState",
    get: ({ get }) => {
        const state = get(singleCourseState);
        if (state.course) {
            return state.course.title
        } else {
            return null
        }
    }
});

export const coursePriceState = selector({
    key: "coursePriceState",
    get: ({ get }) => {
        const state = get(singleCourseState);
        if (state.course) {
            return state.course.price
        } else {
            return null
        }
    }
});

export const courseImageState = selector({
    key: "courseImageState",
    get: ({ get }) => {
        const state = get(singleCourseState);
        if (state.course) {
            return state.course.image
        } else {
            return null
        }
    }
});

export const coursePublishedState = selector({
    key: "coursePublishedState",
    get: ({ get }) => {
        const state = get(singleCourseState);
        if (state.course) {
            return state.course.published
        } else {
            return null
        }
    }
});

export const courseIdState = selector({
    key: "courseIdState",
    get: ({ get }) => {
        const state = get(singleCourseState);
        if (state.course && state.course._id) {
            return state.course._id
        } else {
            return null
        }
    }
})

