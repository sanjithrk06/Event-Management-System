import { REGISTRATION_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { transporter } from "./nodemailer.config.js";

export const sendRegistrationSuccessEmail = async (userEmail, userName) => {
  try {
    transporter.sendMail({
      from: "Events Team",
      to: userEmail,
      subject: "Event Registration Successful",
      html: REGISTRATION_SUCCESS_TEMPLATE.replace("{userName}", userName),
      category: "Event Registration Successful",
    });

    console.log("Event Registration Successful sent successfully");
  } catch (error) {
    console.error(`Error sending Event Registration Successful`, error);

    throw new Error(`Error sending Event Registration Successful: ${error}`);
  }
};
