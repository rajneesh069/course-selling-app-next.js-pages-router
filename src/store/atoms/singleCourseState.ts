import { atom } from "recoil"
import { CourseInterface } from "./allCoursesState";
//"Course" is an object(member) of the array of objects of "Courses".

interface AtomDefault<T> {
    isCourseLoading: boolean;
    course: T | null
}

export const singleCourseState = atom<AtomDefault<CourseInterface>>({
    key: "singleCourseState",
    default: {
        isCourseLoading: true,
        course: null
    }
})