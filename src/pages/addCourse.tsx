import { Button, Card, CardContent, TextField, ToggleButton, ToggleButtonGroup, Typography, Grid } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useRouter } from "next/router";


export default function AddCourse() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291cnNlfGVufDB8fDB8fHww");
    const [price, setPrice] = useState(0);
    const [selected, setSelected] = useState(false);
    return <div style={{ display: "flex", alignItems: "center", height: "100vh" }}>
        <Grid container>
            <Grid marginRight={"3%"} marginLeft={"10%"} item xs={5} sm={5} md={7} lg={7} xl={7}>
                <Card>
                    <CardContent >
                        <TextField onChange={(event) => {
                            const { value } = event.target;
                            setTitle(value);
                        }} value={title} autoComplete="off" sx={{ marginBottom: "1%", width: "100%" }} type="string" fullWidth label={"Title"} />
                        <TextField onChange={(event) => {
                            const { value } = event.target;
                            setDescription(value);
                        }} value={description} autoComplete="off" sx={{ marginBottom: "1%", width: "100%" }} type="string" minRows={4} fullWidth label={"Description"} />
                        <TextField onChange={(event) => {
                            const { value } = event.target;
                            setImage(value);
                        }} value={image} autoComplete="off" sx={{ marginBottom: "1%", width: "100%" }} type="string" minRows={2} fullWidth label={"Image Link"} />
                        <strong>₹</strong><TextField onChange={(event) => {
                            const { value } = event.target;
                            setPrice(Number(value));
                        }} value={price} autoComplete="off" sx={{ marginBottom: "1%", width: "100%" }} type="number" fullWidth label={"Price"} />
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
                    <Button sx={{ marginLeft: "40%", marginBottom: "1%" }} variant="contained" onClick={async () => {
                        const data = { title, price, description, image, published: selected };
                        const response = await axios.post(`${BASE_URL}admin/courses`, data, {
                            headers: {
                                "Content-Type": "application/json"
                            }, withCredentials: true,
                        });
                        if (response.data.newCourse) {
                            router.push("/courses")
                        }
                    }}>Add Course</Button>
                </Card>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                {<img alt="" src={image} style={{ border: "2px dotted black", width: "100%", height: "100%" }} />}
            </Grid>
        </Grid>
    </div>
}