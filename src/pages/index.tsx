import { Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { usernameState } from "../store/selectors/username";

export default function Landing() {
    const username = useRecoilValue(usernameState);
    console.log("username inside landing:", username);
    const router = useRouter();
    return <div style={{ margin: 0, padding: 0 }}>
        <Grid container spacing={5} height={"99.2vh"} justifyContent={"center"} alignItems={"center"}>
            <Grid marginTop={"3%"} marginBottom={"5%"} padding={0} item marginRight={"25%"}>
                <Link href={"/"} style={{ textDecoration: "none", color: "black" }}><Typography variant={"h3"}>Coursera</Typography>
                    <Typography variant={"h6"}>A Place To Grow and Learn</Typography></Link>
                {!username && <Button sx={{ marginTop: "1%" }} onClick={() => {
                    router.push("/signin")
                }} variant="contained">Sign In</Button>}
                &nbsp;&nbsp;
                {!username && <Button sx={{ marginTop: "1%" }} onClick={() => {
                    router.push("/signup")
                }} variant="contained">Sign Up</Button>}
            </Grid>
            <Grid item marginTop={"3%"}>
                <img src="https://images.unsplash.com/photo-1605711285791-0219e80e43a3?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" height={300}></img>
            </Grid>
        </Grid>
    </div>
}


// export function getServerSideProps() {
//     console.log("hi there");
//     return {
//         props: {

//         }
//     };
// }