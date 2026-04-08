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

    // Send confirmation email to the user
    await mailSender(
      email,
      "We received your message - StudyHub",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    // Send notification email to the admin
    await mailSender(
      process.env.MAIL_USER,
      `New Message from ${firstname} ${lastname}`,
      `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${firstname} ${lastname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p style="color: #666;">(You can reply directly to this email to contact the sender)</p>
      `,
      email // Pass the sender's email as replyTo
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
