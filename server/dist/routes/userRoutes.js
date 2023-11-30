"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const mongodb_1 = require("../db/mongodb");
const router = express_1.default.Router();
const zod_1 = require("zod");
const userInput = zod_1.z.object({
    username: zod_1.z.string().min(6).max(50),
    password: zod_1.z.string().min(6).max(20),
});
router.get("/me", auth_1.verifyJwtUser, (req, res) => {
    res.send(200).json({
        username: req.headers.username,
    });
});
router.get("/courses", auth_1.verifyJwtUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield mongodb_1.Course.find({ published: true });
    res.status(200).json({
        courses
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    }
    else {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;
        try {
            const existingUser = yield mongodb_1.User.findOne({ username, password });
            if (existingUser) {
                const token = (0, auth_1.generateJwtUser)({ username });
                res.status(200).json({
                    message: "User signed in successfully!", username
                });
            }
            else {
                res.status(401).json({
                    message: "User not found!"
                });
            }
        }
        catch (error) {
            console.error("Error occured:", error);
        }
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    }
    else {
        const { username, password } = parsedInput.data;
        try {
            const existingUser = yield mongodb_1.User.findOne({ username });
            if (existingUser) {
                res.status(403).json({
                    message: "User already exists!"
                });
                return;
            }
            else {
                const newUser = new mongodb_1.User({
                    username, password
                });
                yield newUser.save();
                const token = (0, auth_1.generateJwtUser)({ username });
                res.status(200).json({
                    message: "User signed up successfully!",
                    token, username
                });
            }
        }
        catch (error) {
            console.error("Error occured:", error);
        }
    }
}));
router.get("/courses/:courseId", auth_1.verifyJwtUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    try {
        const course = yield mongodb_1.Course.findOne({ _id: courseId, published: true });
        res.status(200).json({
            course
        });
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.get("/purchasedCourses", auth_1.verifyJwtUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.headers.username;
    try {
        const user = yield mongodb_1.User.findOne({ username }).populate("purchasedCourses");
        if (user) {
            res.status(200).json({
                purchasedCourses: user.purchasedCourses
            });
        }
        else {
            res.status(401).json({
                message: "User not found",
            });
            return;
        }
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/courses/:courseId", auth_1.verifyJwtUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    try {
        const course = yield mongodb_1.Course.findById(courseId);
        const user = yield mongodb_1.User.findOne({ username });
        if (user && course && course.published) {
            user.purchasedCourses.push(course._id);
            yield user.save();
            res.status(200).json({
                message: "Course purchased successfully!",
                courseID: course._id,
                courseId
            });
        }
        else {
            res.status(404).json({
                message: "User/Course Not found"
            });
        }
    }
    catch (error) {
        console.log("Error:", error);
    }
}));
exports.default = router;
