import express from "express";

import {
  getResources,
  getAllResourcesAdmin,
  getResource,
  createResource,
  approveResource,
  rejectResource,
  deleteResource,
} from "../controllers/resource.controller.js";

const router = express.Router();

router.get("/", getResources);

router.get("/admin", getAllResourcesAdmin);

router.get("/:id", getResource);

router.post("/", createResource);

router.patch("/:id/approve", approveResource);

router.patch("/:id/reject", rejectResource);

router.delete("/:id", deleteResource);

export default router;