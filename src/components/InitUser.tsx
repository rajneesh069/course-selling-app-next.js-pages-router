import { userState } from "@/store/atoms/userState";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";

export default function InitUser() {
    const setUser = useSetRecoilState(userState);
    console.log("Init user made the request!");
    useEffect(() => {
        const init = async () => {
            try {
                const response = await axios.get(`${BASE_URL}admin/me`, {
                    headers: {
                        "Content-Type": "application/json"
                    }, withCredentials: true,
                });
                if (response.data.username) {
                    setUser({
                        isUserLoading: false,
                        username: response.data.username,
                    })
                }
                else {
                    setUser({
                        isUserLoading: false,
                        username: null,
                    })
                }
            } catch (error) {
                setUser({
                    isUserLoading: false,
                    username: null
                })
                console.error("Error:", error);
            }
        }
        init();
    }, [setUser]);


    return <></>
}