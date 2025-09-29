import { Router } from "express";
import {
  getProperties,
  getProperty,
  createProperty,
} from "../controllers/propertyControllers";
import { upload } from "../middleware/upload";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// ---------------- PUBLIC ROUTES ----------------
router.get("/", getProperties);
router.get("/:id", getProperty);

// ---------------- PROTECTED ROUTES ----------------
// ✅ Only managers can create properties
router.post(
  "/",
  authMiddleware(["manager"]), // role-based protection
  upload.array("photos"),      // must match FormData.append("photos")
  createProperty
);

export default router;

