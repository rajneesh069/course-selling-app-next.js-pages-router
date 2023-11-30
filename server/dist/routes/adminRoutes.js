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
const adminInput = zod_1.z.object({
    username: zod_1.z.string().min(6).max(50),
    password: zod_1.z.string().min(6).max(20),
});
const adminCourseInput = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(5),
    price: zod_1.z.number(),
    image: zod_1.z.string(),
    published: zod_1.z.boolean(),
});
router.get("/me", auth_1.verifyJwtAdmin, (req, res) => {
    res.status(200).json({
        username: req.headers.username,
    });
});
router.get("/logout", auth_1.verifyJwtAdmin, (req, res) => {
    res.clearCookie("adminToken");
    res.status(200).json({
        message: "Logged out succesfully!"
    });
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = adminInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    }
    else {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;
        try {
            const isAdmin = yield mongodb_1.Admin.findOne({ username });
            if (isAdmin) {
                res.status(403).json({
                    message: "Admin already exists"
                });
            }
            else {
                const token = (0, auth_1.generateJwtAdmin)({ username });
                res.cookie("adminToken", token, { domain: "localhost", path: "/", httpOnly: true });
                const newAdmin = new mongodb_1.Admin({
                    username, password
                });
                yield newAdmin.save();
                res.status(200).json({
                    message: "Admin signed up successfully", username
                });
            }
        }
        catch (error) {
            console.error("Error occured:", error);
        }
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = adminInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    }
    else {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;
        try {
            const existingAdmin = yield mongodb_1.Admin.findOne({ username, password });
            if (existingAdmin) {
                const token = (0, auth_1.generateJwtAdmin)({ username });
                res.cookie("adminToken", token, { domain: "localhost", path: "/", httpOnly: true });
                res.send({
                    message: "Admin signed in successfully", username
                });
            }
            else {
                res.status(401).json({
                    message: "Admin not found!"
                });
            }
        }
        catch (error) {
            console.error("Error occured:", error);
        }
    }
}));
router.get("/courses", auth_1.verifyJwtAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ courses: yield mongodb_1.Course.find({}) });
}));
router.post("/courses", auth_1.verifyJwtAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = adminCourseInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.sendStatus(403);
        return;
    }
    else {
        const { title, image, description, published, price } = parsedInput.data;
        try {
            const isCourse = yield mongodb_1.Course.findOne({ title, image, description, published, price });
            if (isCourse) {
                res.status(403).json({
                    message: "Course already exists"
                });
                return;
            }
            else {
                const newCourse = new mongodb_1.Course({ title, image, description, published, price });
                yield newCourse.save();
                res.status(201).json({
                    message: "Course saved successfully",
                    newCourse
                });
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    }
}));
router.get("/courses/:courseId", auth_1.verifyJwtAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield mongodb_1.Course.findOne({ _id: req.params.courseId });
    if (course) {
        res.status(200).json({ course });
        return;
    }
    else {
        res.status(204).json({
            message: "Course not found!"
        });
    }
}));
router.put("/courses/:courseId", auth_1.verifyJwtAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    try {
        const updatedCourse = yield mongodb_1.Course.findByIdAndUpdate({ _id: courseId }, req.body, { new: true });
        res.status(200).json({
            message: "Course updated successfully",
            updatedCourse
        });
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
exports.default = router;
