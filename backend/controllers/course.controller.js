import { Course } from "../models/course.model.js";
//import { v2 as cloudinary } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    // Validate fields
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "No image file uploaded" });
    }

    const { image } = req.files;

    const allowedFormats = ["image/png", "image/jpeg"];
    if (!allowedFormats.includes(image.mimetype)) {
      return res.status(400).json({
        errors: "Invalid file format. Only PNG and JPG are allowed",
      });
    }

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "courses",
      use_filename: true,
      unique_filename: false,
    });

    if (!cloudResponse || cloudResponse.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to Cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloudResponse.public_id,
        url: cloudResponse.secure_url,
      },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Error creating course" });
  }
};

// export const updateCourse = async (req, res) => {
//   const adminId = req.adminId;
//   const { courseId } = req.params;
//   const { title, description, price, image } = req.body;
//   try {
//     const courseSearch = await Course.findById(courseId);
//     if (!courseSearch) {
//       return res.status(404).json({ errors: "Course not found" });
//     }
//     const course = await Course.findOneAndUpdate(
//       {
//         _id: courseId,
//         creatorId: adminId,
//       },
//       {
//         title,
//         description,
//         price,
//         image: {
//           public_id: image?.public_id,
//           url: image?.url,
//         },
//       },
//       {
//         new: true, // return the updated document
//       }
//     );
//     if (!course) {
//       return res
//         .status(404)
//         .json({ errors: "can't update, created by other admin" });
//     }
//     res.status(201).json({ message: "Course updated successfully", course });
//   } catch (error) {
//     res.status(500).json({ errors: "Error in course updating" });
//     console.log("Error in course updating ", error);
//   }
// };
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    // Build update fields object conditionally
    const updateFields = {
      title,
      description,
      price,
    };

    if (image && image.public_id && image.url) {
      updateFields.image = {
        public_id: image.public_id,
        url: image.url,
      };
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      updateFields,
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Can't update, course created by another admin" });
    }

    res.status(201).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error in course updating", error);
    res.status(500).json({ errors: "Error in course updating" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course deleting", error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" });
    console.log("error to get courses", error);
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in course details", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
//console.log(config.STRIPE_SECRET_KEY);
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    //stripe payment code goes here!!
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
