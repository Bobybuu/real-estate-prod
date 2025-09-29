import { Router } from "express";
import { getProperties, getProperty, createProperty } from "../controllers/propertyControllers";
import { upload } from "../middleware/upload";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/", getProperties);
router.get("/:id", getProperty);

// Protected route for creating a property
router.post(
  "/",
  authMiddleware(["manager"]), // only managers can create
  upload.array("photos"),      // handle file uploads
  createProperty
);

export default router;

