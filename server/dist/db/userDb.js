"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb://localhost:27017/newCourseSellingAppDB");
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
