import { sendContactEmail } from '../utils/emailContactService.js';

export const contactFormHandler = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Additional validation can be added here (e.g., email format)

    // Send email to site admin or support email
    const toEmail = process.env.SMTP_FROM_EMAIL || 'hello@suzao.com';

    await sendContactEmail(toEmail, { name, email, subject, message });

    return res.status(200).json({ message: 'Contact form submitted successfully.' });
  } catch (error) {
    console.error('Error in contactFormHandler:', error);
    return res.status(500).json({ error: 'Failed to send contact form email.' });
  }
};
