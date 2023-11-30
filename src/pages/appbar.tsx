import { Typography, Button, CircularProgress } from "@mui/material";
import { Grid } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { usernameState } from "../store/selectors/username";
import { isUserLoadingState } from "../store/selectors/isLoading";
import { userState } from "../store/atoms/userState";
import axios from "axios";
import { BASE_URL } from "@/config";

export default function Appbar() {
    const router = useRouter();
    const username = useRecoilValue(usernameState);
    const isUserLoading = useRecoilValue(isUserLoadingState);
    const setUser = useSetRecoilState(userState);
    if (isUserLoading) {
        return <CircularProgress />
    }
    if (username) {
        return (
            <div style={{
                margin: "0px",
                padding: "0.25%",
                backgroundColor: "#eee",
            }}>
                <Grid container spacing={2} justifyContent={"space-between"}>
                    <Grid item order={0}>
                        <Link href={"/"} style={{ textDecoration: "none", color: "black" }}> <Typography variant={"h6"}>Coursera</Typography></Link>
                    </Grid>
                    <Grid item order={1}>
                        <Button onClick={() => {
                            router.push("/")
                        }} variant="contained">Home</Button>
                        &nbsp;&nbsp;
                        <Button onClick={() => {
                            router.push("/addCourse")
                        }} variant="contained">Add Course</Button>
                        &nbsp;&nbsp;
                        <Button onClick={() => {
                            router.push("/courses")
                        }} variant="contained">Courses</Button>
                        &nbsp;&nbsp;
                        <Button onClick={async () => {
                            const response = await axios.get(`${BASE_URL}admin/logout`, {
                                headers: {
                                    "Content-Type": "application/json"
                                }, withCredentials: true,
                            });
                            setUser({
                                isUserLoading: false,
                                username: null,
                            })
                            router.push("/");
                        }} variant="contained">Logout</Button>
                    </Grid>
                </Grid>
            </div>
        )
    } else {
        return (
            <div style={{
                margin: "0px",
                padding: "0.25%",
                backgroundColor: "#eee",
            }}>
                <Grid container spacing={2} justifyContent={"space-between"}>
                    <Grid item order={0}>
                        <Link href={"/"} style={{ textDecoration: "none", color: "black" }}> <Typography variant={"h6"}>Coursera</Typography></Link>
                    </Grid>
                    <Grid item order={1}>
                        <Button onClick={() => {
                            router.push("/signin")
                        }} variant="contained">Sign In</Button>
                        &nbsp;&nbsp;
                        <Button onClick={() => {
                            router.push("/signup")
                        }} variant="contained">Sign Up</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }

}
