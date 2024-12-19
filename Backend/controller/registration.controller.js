import { Registration } from "../model/registration.model.js";
import { Event } from "../model/event.model.js";
import { sendRegistrationSuccessEmail } from "../nodemailer/emails.js";

export const registerForEvent = async (req, res) => {
  try {
    const { eventId, userName, userEmail } = req.body;

    if (!eventId || !userName || !userEmail) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const registration = new Registration({
      eventId,
      userName,
      userEmail,
    });

    await registration.save();

    await sendRegistrationSuccessEmail(userEmail, userName);

    res.status(201).json({
      message: "Registration successful!",
      data: registration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate(
      "eventId",
      "name date location"
    );
    res.status(200).json({
      message: "Registrations retrieved successfully.",
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getRegistrationsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ eventId }).populate(
      "eventId",
      "name date location"
    );
    res.status(200).json({
      message: "Registrations for the event retrieved successfully.",
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findByIdAndDelete(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    res.status(200).json({ message: "Registration deleted successfully." });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getRegistrationCount = async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching registration count:", error);
    res.status(500).json({ message: "Failed to fetch registration count" });
  }
};
