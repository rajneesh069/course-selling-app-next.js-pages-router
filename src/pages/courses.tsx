import axios from "axios";
import { useEffect } from "react"
import { BASE_URL } from "../config";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CourseInterface, allCoursesState } from "../store/atoms/allCoursesState";
import { allCoursesArrayState } from "../store/selectors/allCoursesArray";
import { isAllCoursesLoadingState } from "../store/selectors/isLoading";
import { LinearProgress, Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Courses() {
    const router = useRouter();
    const setCourses = useSetRecoilState(allCoursesState);
    const courses = useRecoilValue(allCoursesArrayState);
    const isCoursesLoading = useRecoilValue(isAllCoursesLoadingState);
    useEffect(() => {
        const initAllCourses = async () => {
            try {
                const response = await axios.get(`${BASE_URL}admin/courses`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                if (response.data.courses) {
                    setCourses({
                        isCoursesLoading: false,
                        courses: response.data.courses
                    })
                } else {
                    setCourses({
                        isCoursesLoading: false,
                        courses: null
                    })
                }
            } catch (error) {
                setCourses({
                    isCoursesLoading: false,
                    courses: null
                })
                console.error("Error:", error);
            }
        }
        initAllCourses();
    }, [setCourses])
    if (isCoursesLoading) {
        return <LinearProgress />
    }
    if (courses) {
        return (<div id="container" style={{ margin: "2%", padding: "0" }}>
            <Grid container spacing={2}>
                {courses.map((course: CourseInterface) => {
                    return <Grid item xs={12} md={4} lg={4} key={course._id}>
                        <Card sx={{ background: "#eee" }} key={course._id}>
                            <CardContent sx={{ width: "85%" }}>
                                <img src={course.image} style={{ borderRadius: "5%", marginLeft: "10px", marginRight: "10px", width: "100%" }} />
                                <Typography sx={{ marginLeft: "10%", marginTop: "2%" }} variant="h6">{course.title}</Typography>
                                <Typography sx={{ marginLeft: "10%", marginTop: "1%" }}>{course.description}</Typography>
                                <Typography sx={{ marginLeft: "10%", marginTop: "1%" }} variant="h5">₹{course.price}</Typography>
                            </CardContent>
                            <Button sx={{ marginLeft: "38%", marginBottom: "3%" }} variant="contained" onClick={() => {
                                router.push("/courses/" + course._id);
                            }}>Edit</Button>
                        </Card>
                    </Grid>
                })}
            </Grid>
        </div>)
    } else {
        return "Error 404"
    }

}

// export async function getServerSideProps(){

// }
