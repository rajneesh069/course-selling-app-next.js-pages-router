import express from "express";
import { generateJwtUser, verifyJwtUser } from "../middlewares/auth";
import { Course, User } from "../db/mongodb";
const router = express.Router();
import { z } from "zod";

const userInput = z.object({
    username: z.string().min(6).max(50),
    password: z.string().min(6).max(20),
});
router.get("/me", verifyJwtUser, (req, res) => {
    res.send(200).json({
        username: req.headers.username,
    })
});

router.get("/courses", verifyJwtUser, async (req, res) => {
    const courses = await Course.find({ published: true });
    res.status(200).json({
        courses
    });
});

router.post("/signin", async (req, res) => {
    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    } else {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;
        try {
            const existingUser = await User.findOne({ username, password });
            if (existingUser) {
                const token = generateJwtUser({ username });
                res.status(200).json({
                    message: "User signed in successfully!", username
                });
            } else {
                res.status(401).json({
                    message: "User not found!"
                });
            }
        } catch (error) {
            console.error("Error occured:", error);
        }
    }
});

router.post("/signup", async (req, res) => {
    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    } else {
        const { username, password } = parsedInput.data;
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                res.status(403).json({
                    message: "User already exists!"
                });
                return;
            } else {
                const newUser = new User({
                    username, password
                });
                await newUser.save();
                const token = generateJwtUser({ username });
                res.status(200).json({
                    message: "User signed up successfully!",
                    token, username
                })
            }
        } catch (error) {
            console.error("Error occured:", error);
        }
    }
});

router.get("/courses/:courseId", verifyJwtUser, async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const course = await Course.findOne({ _id: courseId, published: true });
        res.status(200).json({
            course
        });
    } catch (error) {
        console.error("Error:", error);
    }
});

router.get("/purchasedCourses", verifyJwtUser, async (req, res) => {
    const username = req.headers.username;
    try {
        const user = await User.findOne({ username }).populate("purchasedCourses");
        if (user) {
            res.status(200).json({
                purchasedCourses: user.purchasedCourses
            });
        } else {
            res.status(401).json({
                message: "User not found",
            })
            return;
        }
    } catch (error) {
        console.error(error);
    }
});

router.post("/courses/:courseId", verifyJwtUser, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    try {
        const course = await Course.findById(courseId);
        const user = await User.findOne({ username });
        if (user && course && course.published) {
            user.purchasedCourses.push(course._id);
            await user.save();
            res.status(200).json({
                message: "Course purchased successfully!",
                courseID: course._id,
                courseId
            })
        } else {
            res.status(404).json({
                message: "User/Course Not found"
            })
        }
    } catch (error) {
        console.log("Error:", error);
    }
})
export default router;