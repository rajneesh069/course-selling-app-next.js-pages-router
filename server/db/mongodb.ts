import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/newCourseSellingAppDB");

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.ObjectId, ref: "Course" }]
});

const courseSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    published: Boolean,
})


const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
export { Admin, User, Course };