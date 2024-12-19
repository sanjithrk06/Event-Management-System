import express from "express";
import {
  createEvent,
  deleteCategory,
  getAllEvents,
  getEventByEventId,
  getEventById,
  getEventCount,
  updateCategory,
} from "../controller/event.controller.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/eventId/:eventId", getEventByEventId);
router.get("/id/:id", getEventById);

router.get("/count", getEventCount);

router.post("/create", createEvent);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
