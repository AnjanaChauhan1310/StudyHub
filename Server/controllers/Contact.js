const mailSender = require("../utils/mailSender");
const { contactUsEmail } = require("../mail/templates/contactFormRes");

exports.contactUsController = async (req, res) => {
  try {
    const { email, firstname, lastname = "", message, phoneNo, countrycode } = req.body;

    if (!email || !firstname || !message || !phoneNo || !countrycode) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    await mailSender(
      email,
      "We received your message",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    return res.status(200).json({
      success: true,
      message: "Contact message sent successfully",
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send contact form right now",
    });
  }
};
