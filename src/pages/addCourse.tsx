import { Button, Card, CardContent, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
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
    const [image, setImage] = useState("");
    const [price, setPrice] = useState(0);
    const [selected, setSelected] = useState(false);
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Card >
            <CardContent >
                <img src={image} width={"250px"} />
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
            <Button variant="contained" onClick={async () => {
                const data = { title, price, description, image, published: selected };
                const response = await axios.post(`${BASE_URL}admin/courses`, data, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                if (response.data.newCourse) {
                    router.push("/courses")
                }
            }}>Add Course</Button>
        </Card>
    </div>
}