import express from "express";
import { test, updateUser, updateUserProperty, deleteUser, sendEmail, getProperties, getAllProperties, updateLikes, updateMyLikedProperties, getSellerInfo } from "../controllers/user.controller.js";//destructured
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", test);
router.get("/properties/:id", getProperties);
router.get("/properties", getAllProperties);
router.get("/properties/contact/:uniqueId", getSellerInfo);
router.put("/sendEmail", sendEmail);
// router.post("/update/:id",verifyToken,updateUser);
// router.put("/update/property/:id",verifyToken,updateUserProperty);
// router.put("/update/property/updateLikes/:id",verifyToken,updateLikes);
// router.put("/update/updateMyLikedProperties/:id",verifyToken,updateMyLikedProperties);
// router.delete("/delete/:id",verifyToken,deleteUser);
router.post("/update/:id", updateUser);
router.put("/update/property/:id", updateUserProperty);
router.put("/update/property/updateLikes/:id", updateLikes);
router.put("/update/updateMyLikedProperties/:id", updateMyLikedProperties);
router.delete("/delete/:id", deleteUser);

export default router;