import { Grid, Card, CardContent, Typography, Button, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useRecoilState, useRecoilValue, } from "recoil";
import { courseDescriptionState, courseImageState, coursePriceState, coursePublishedState, courseTitleState } from "../store/selectors/course";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useRouter } from "next/router";
import { singleCourseState } from "../store/atoms/singleCourseState";


export default function CourseCard() {
    return (<div style={{ marginBottom: "1%", padding: 0 }}>
        <div style={{ backgroundColor: "black", width: "100%", height: "200px", zIndex: -10 }}></div>
        <Grid position={"relative"} zIndex={2} top={-140} container spacing={3}>
            <Grid item xs={12} sm={12} md={4} marginLeft={2} marginRight={2}>
                <UpdateCard />
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
                <div></div>
            </Grid>
            <Grid item xs={12} sm={12} md={4} marginLeft={4} marginRight={2}>
                <Card sx={{ background: "#eee", }}>
                    <CardContent sx={{ width: "85%" }}>
                        <CourseImage />
                        <Title />
                        <Description />
                        <Price />
                        <Published />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
    )
}

function CourseImage() {
    const image = useRecoilValue(courseImageState);
    return image && <img src={image} style={{ borderRadius: "5%", marginLeft: "10px", marginRight: "10px", width: "100%" }} />
}

function Title() {
    const title = useRecoilValue(courseTitleState);
    return <Typography sx={{ marginLeft: "10%", marginTop: "2%" }} variant="h6">{title}</Typography>
}

function Description() {
    const description = useRecoilValue(courseDescriptionState);
    return <Typography sx={{ marginLeft: "10%", marginTop: "1%" }}>{description}</Typography>
}

function Price() {
    const price = useRecoilValue(coursePriceState);
    return <Typography sx={{ marginLeft: "10%", marginTop: "1%" }} variant="h5">₹{price}</Typography>
}

function Published() {
    const isPublished = useRecoilValue(coursePublishedState);
    if (isPublished) { return <Typography sx={{ marginLeft: "10%", marginTop: "1%" }} variant="subtitle1">Course is published</Typography> }
    else {
        return <Typography sx={{ marginLeft: "10%", marginTop: "1%" }} variant="subtitle1">Course is not published</Typography>
    }
}

function UpdateCard() {
    const router = useRouter();
    const [courseDetails, setCourseDetails] = useRecoilState(singleCourseState);
    const [title, setTitle] = useState(courseDetails.course?.title);
    const [description, setDescription] = useState(courseDetails.course?.description);
    const [price, setPrice] = useState(courseDetails.course?.price);
    const [image, setImage] = useState(courseDetails.course?.image);
    const [selected, setSelected] = useState(courseDetails.course?.published);
    const { courseId } = router.query;
    //To set the initial values of the update card if they don't get properly set, I've used useEffect()
    //PS - it was a bug and initial values weren't getting properly set.
    useEffect(() => {
        setTitle(courseDetails.course?.title);
        setDescription(courseDetails.course?.description);
        setPrice(courseDetails.course?.price);
        setImage(courseDetails.course?.image);
        setSelected(courseDetails.course?.published)
    }, [courseId, courseDetails]);
    return (
        <Card sx={{ background: "#eee", }}>
            <CardContent sx={{ width: "85%" }}>
                <Typography variant="h5" sx={{ marginBottom: "1%" }}>Update Course</Typography>
                <img src={image} style={{ borderRadius: "5%", marginLeft: "10px", marginRight: "10px", width: "100%" }} />
                <TextField minRows={2} autoComplete="off" fullWidth variant="outlined" onChange={(event) => {
                    const { value } = event.target;
                    setTitle(value);
                }} sx={{ marginLeft: "7%", marginTop: "2%", marginBottom: "1%" }} value={title} label={"Title"} />
                <TextField minRows={5} autoComplete="off" fullWidth variant="outlined" onChange={(event) => {
                    const { value } = event.target;
                    setDescription(value);
                }} value={description} sx={{ marginLeft: "7%", marginTop: "1%", marginBottom: "1%" }} label={"Description"} />
                <TextField minRows={2} autoComplete="off" fullWidth variant="outlined" onChange={(event) => {
                    const { value } = event.target;
                    setImage(value);
                }} value={image} sx={{ marginLeft: "7%", marginTop: "1%", marginBottom: "1%" }} label={"Image Link"} />
                <TextField minRows={2} autoComplete="off" fullWidth variant="outlined" onChange={(event) => {
                    const { value } = event.target;
                    setPrice(Number(value));
                }} value={price} sx={{ marginLeft: "7%", marginTop: "1%", marginBottom: "1%" }} label={"Price"} />
                <Typography marginLeft={"2%"} variant="subtitle1">Publish: &nbsp;&nbsp;&nbsp;
                    <ToggleButtonGroup exclusive onChange={() => {
                        setSelected(!selected);
                    }}>
                        <ToggleButton
                            value="check"
                            selected={selected}
                        >
                            <CheckIcon />
                        </ToggleButton>
                        <ToggleButton
                            value={"unCheck"}
                            selected={!selected}>
                            <CloseIcon />
                        </ToggleButton></ToggleButtonGroup></Typography>
            </CardContent>
            <Button sx={{ marginBottom: "2%", marginLeft: "30%" }} variant="contained" onClick={async () => {
                const data = { title, description, image, price, published: selected };
                const response = await axios.put(`${BASE_URL}admin/courses/` + courseId, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }, withCredentials: true,
                });
                if (response.data.updatedCourse) {
                    setCourseDetails({
                        isCourseLoading: false,
                        course: response.data.updatedCourse
                    })
                } else {
                    return "No response"
                }
            }}>Update Course</Button>
        </Card>
    )
}