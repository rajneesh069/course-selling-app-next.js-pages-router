import axios from "axios";
const BASE_URL = "http://localhost:5000/";
import { singleCourseState } from "../../store/atoms/singleCourseState";
import { useSetRecoilState } from "recoil";
import { LinearProgress } from "@mui/material";
import CourseCard from "../courseCard";
import { CourseInterface } from "@/store/atoms/allCoursesState";


export default function Course({ isCourseLoading, course }: { isCourseLoading: boolean, course: CourseInterface }) {
    const setCourse = useSetRecoilState(singleCourseState);
    if (!isCourseLoading && course) {
        setCourse({
            isCourseLoading: false,
            course: course,
        });
    }

    if (isCourseLoading) {
        return <LinearProgress />
    }
    else {
        return <CourseCard />
    }

}

export async function getServerSideProps(context: { params: { courseId: string }, req: { headers: { cookie: string } } }) {
    const { courseId } = context.params;
    try {
        const response = await axios.get(`${BASE_URL}admin/courses/${courseId}`, {
            headers: {
                "Content-Type": "application/json",
                Cookie: context.req.headers.cookie,
            }, withCredentials: true,
        });
        if (response.data.course) {
            return {
                props: {
                    isCourseLoading: false,
                    course: response.data.course,
                }
            }
        } else {
            return {
                props: {
                    isCourseLoading: false,
                    course: null,
                }
            }
        }
    } catch (error) {
        console.log("Error:", error);
        return {
            props: {
                isCourseLoading: false,
                course: null,
            }
        }
    }
}