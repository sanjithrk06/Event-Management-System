import { Event } from "../model/event.model.js";

export const createEvent = async (req, res) => {
  const { eventId, name, date, location, description } = req.body;
  // console.log(req.body);

  try {
    const existingEvent = await Event.findOne({ name });
    if (existingEvent) {
      return res.status(400).json({ message: "Event already exists" });
    }

    const newEvent = new Event({
      eventId,
      name,
      date,
      location,
      description,
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getEventByEventId = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findOne({ eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event found", data: event });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findOne({ _id: id });

    if (!event) {
      return res.status(201).json({ message: "Event not found" });
    }

    res.status(201).json({ message: "Event found", data: event });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    if (events.length === 0) {
      return res.status(201).json({ message: "No events found" });
    }

    res.status(201).json({ data: events });
  } catch (error) {
    console.error("Error retrieving events:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, location, date, description } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(201).json({ message: "Event not found" });
    }

    event.name = name;
    event.location = location;
    event.date = date;
    event.description = description;

    await event.save();

    res.status(201).json({
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(201).json({ message: "Event not found" });
    }

    res.status(201).json({
      message: "Event deleted successfully",
      data: deletedEvent,
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getEventCount = async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching event count:", error);
    res.status(500).json({ message: "Failed to fetch event count" });
  }
};
