import nodemailer from 'nodemailer';

const log = (message) => {
  console.log(`[emailContactService] ${new Date().toISOString()} - ${message}`);
};

const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM_EMAIL',
];

const checkEnvVars = () => {
  let allDefined = true;
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.error(`Error: Environment variable ${varName} is not defined.`);
      allDefined = false;
    }
  });
  return allDefined;
};

const getTransporter = () => {
  if (!checkEnvVars()) {
    throw new Error('Missing required SMTP environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      log(`SMTP transporter verification failed: ${error.message}`);
    } else {
      log('SMTP transporter verified successfully');
    }
  });

  return transporter;
};

/**
 * Send contact form email
 * @param {string} toEmail - Recipient email address
 * @param {object} formData - Contact form data { name, email, subject, message }
 */
export const sendContactEmail = async (toEmail, formData) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: toEmail,
    subject: `Contact Form Submission: ${formData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:rgb(123, 107, 228);">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>Thank you,<br/>The Suzao Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    log(`Contact form email sent successfully to ${toEmail}`);
  } catch (error) {
    log(`Failed to send contact form email to ${toEmail}: ${error.message}`);
    if (error.response) {
      log(`SMTP response: ${error.response}`);
    }
    throw error;
  }
};
