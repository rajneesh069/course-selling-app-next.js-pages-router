import { atom } from "recoil";
//Courses is an array of objects. This is the atom for all courses
//which consists of array of course objects.

export interface CourseInterface {
    title: string;
    description: string;
    price: number;
    _id: string;
    published: boolean;
    image: string;
}

interface AtomDefault<T> {
    isCoursesLoading: boolean;
    courses: T | null
}

export const allCoursesState = atom<AtomDefault<CourseInterface[]>>({
    key: "allCoursesState",
    default: {
        isCoursesLoading: true,
        courses: null
    }
})