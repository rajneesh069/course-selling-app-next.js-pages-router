import express from "express";
import { generateJwtAdmin, verifyJwtAdmin } from "../middlewares/auth";
import { Admin, Course } from "../db/mongodb";
const router = express.Router();
import { z } from "zod";

const adminInput = z.object({
   username: z.string().min(6).max(50),
   password: z.string().min(6).max(20),
});

const adminCourseInput = z.object({
   title: z.string().min(5),
   description: z.string().min(5),
   price: z.number(),
   image: z.string(),
   published: z.boolean(),
})

router.get("/me", verifyJwtAdmin, (req, res) => {
   res.status(200).json({
      username: req.headers.username,
   });
});

router.get("/logout", verifyJwtAdmin, (req, res) => {
   res.clearCookie("adminToken");
   res.status(200).json({
      message: "Logged out succesfully!"
   });
})

router.post("/signup", async (req, res) => {
   const parsedInput = adminInput.safeParse(req.body);
   if (!parsedInput.success) {
      res.sendStatus(403);
      return;
   } else {
      const username = parsedInput.data.username;
      const password = parsedInput.data.password;
      try {
         const isAdmin = await Admin.findOne({ username })
         if (isAdmin) {
            res.status(403).json({
               message: "Admin already exists"
            });
         } else {
            const token = generateJwtAdmin({ username });
            res.cookie("adminToken", token, { domain: "localhost", path: "/", httpOnly: true });
            const newAdmin = new Admin({
               username, password
            });
            await newAdmin.save();
            res.status(200).json({
               message: "Admin signed up successfully", username
            });
         }
      } catch (error) {
         console.error("Error occured:", error);
      }
   }
}
);

router.post("/signin", async (req, res) => {
   const parsedInput = adminInput.safeParse(req.body);
   if (!parsedInput.success) {
      res.sendStatus(403);
      return;
   } else {
      const username = parsedInput.data.username;
      const password = parsedInput.data.password;
      try {
         const existingAdmin = await Admin.findOne({ username, password });
         if (existingAdmin) {
            const token = generateJwtAdmin({ username });
            res.cookie("adminToken", token, { domain: "localhost", path: "/", httpOnly: true });
            res.send({
               message: "Admin signed in successfully", username
            })
         } else {
            res.status(401).json({
               message: "Admin not found!"
            });
         }
      } catch (error) {
         console.error("Error occured:", error);
      }
   }
});

router.get("/courses", verifyJwtAdmin, async (req, res) => {
   res.status(200).json({ courses: await Course.find({}) });
});

router.post("/courses", verifyJwtAdmin, async (req, res) => {
   const parsedInput = adminCourseInput.safeParse(req.body);
   if (!parsedInput.success) {
      res.sendStatus(403);
      return;
   } else {
      const { title, image, description, published, price } = parsedInput.data;
      try {
         const isCourse = await Course.findOne({ title, image, description, published, price });
         if (isCourse) {
            res.status(403).json({
               message: "Course already exists"
            });
            return;
         } else {
            const newCourse = new Course({ title, image, description, published, price });
            await newCourse.save();
            res.status(201).json({
               message: "Course saved successfully",
               newCourse
            })
         }
      } catch (error) {
         console.error("Error:", error);
      }
   }
});

router.get("/courses/:courseId", verifyJwtAdmin, async (req, res) => {
   const course = await Course.findOne({ _id: req.params.courseId });
   if (course) {
      res.status(200).json({ course });
      return;
   } else {
      res.status(204).json({
         message: "Course not found!"
      });
   }

});

router.put("/courses/:courseId", verifyJwtAdmin, async (req, res) => {
   const courseId = req.params.courseId;
   try {
      const updatedCourse = await Course.findByIdAndUpdate({ _id: courseId }, req.body, { new: true });
      res.status(200).json({
         message: "Course updated successfully",
         updatedCourse
      })
   } catch (error) {
      console.error("Error:", error);
   }
})

export default router;