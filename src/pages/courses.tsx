import axios from "axios";
import { BASE_URL } from "../config";
import { CourseInterface } from "../store/atoms/allCoursesState";
import { LinearProgress, Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Courses({ courses, isCoursesLoading }: { courses: CourseInterface[], isCoursesLoading: boolean }) {
    const router = useRouter();
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
                                <img alt="" src={course.image} style={{ borderRadius: "5%", marginLeft: "10px", marginRight: "10px", width: "100%" }} />
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

export async function getServerSideProps(context: {
    req: {
        headers: {
            cookie: string;
        };
    };
}) {

    try {
        const response = await axios.get(`${BASE_URL}admin/courses`, {
            headers: {
                "Content-Type": "application/json",
                Cookie: context.req.headers.cookie,
            },
            withCredentials: true,
        });

        if (response.data.courses) {
            return {
                props: {
                    isCoursesLoading: false,
                    courses: response.data.courses,
                },
            };
        } else {
            return {
                props: {
                    isCoursesLoading: false,
                    courses: null,
                },
            };
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            props: {
                isCoursesLoading: false,
                courses: null,
            },
        };
    }
}
