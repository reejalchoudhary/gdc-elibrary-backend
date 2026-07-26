import express from "express";

import {
  getResources,
  getResource,
  createResource,
  deleteResource,
} from "../controllers/resource.controller.js";

const router = express.Router();

router.get("/", getResources);

router.get("/:id", getResource);

router.post("/", createResource);

router.delete("/:id", deleteResource);

export default router;