"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.User = exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb://127.0.0.1:27017/newCourseSellingAppDB");
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    purchasedCourses: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Course" }]
});
const courseSchema = new mongoose_1.default.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    published: Boolean,
});
const Admin = mongoose_1.default.model("Admin", adminSchema);
exports.Admin = Admin;
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const Course = mongoose_1.default.model("Course", courseSchema);
exports.Course = Course;
