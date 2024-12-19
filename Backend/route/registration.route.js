import express from "express";
import {
  registerForEvent,
  getAllRegistrations,
  getRegistrationsByEvent,
  deleteRegistration,
  getRegistrationCount,
} from "../controller/registration.controller.js";

const router = express.Router();

router.post("/", registerForEvent);

router.get("/", getAllRegistrations);

router.get("/:eventId", getRegistrationsByEvent);

router.get("/count", getRegistrationCount);

router.delete("/:id", deleteRegistration);

export default router;
