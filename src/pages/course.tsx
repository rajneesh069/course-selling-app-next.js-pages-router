import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { singleCourseState } from "../store/atoms/singleCourseState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSingleCourseLoadingState } from "../store/selectors/isLoading";
import { LinearProgress } from "@mui/material";
import CourseCard from "./courseCard";


export default function Course() {
    const setCourse = useSetRecoilState(singleCourseState);
    const router = useRouter();
    const { courseId } = router.query;
    const isCourseLoading = useRecoilValue(isSingleCourseLoadingState);
    useEffect(() => {
        const init = async () => {
            const response = await axios.get(`${BASE_URL}admin/courses/${courseId}`, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true,
            });
            if (response.data.course) {
                setCourse({
                    isCourseLoading: false,
                    course: response.data.course,
                });
            } else {
                return "Error 404"
            }
        };
        init();
    }, [courseId, setCourse])

    if (isCourseLoading) {
        return <LinearProgress />
    }
    else {
        return <CourseCard />
    }

}
