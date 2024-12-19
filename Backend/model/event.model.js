import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", EventSchema);
