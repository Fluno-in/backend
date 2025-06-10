import nodemailer from 'nodemailer';

const log = (message) => {
  console.log(`[emailService] ${new Date().toISOString()} - ${message}`);
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
    } else {
    //   console.log(`SMTP Loaded in environment variable`);
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
 * Send password reset email with reset link
 * @param {string} toEmail - Recipient email address
 * @param {string} resetUrl - Password reset URL
 */
export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:rgb(123, 107, 228);">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: rgb(130, 114, 233); color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If the button above does not work, copy and paste the following URL into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>If you did not request this, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,<br/>The Suzao Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    log(`Password reset email sent successfully to ${toEmail}`);
  } catch (error) {
    log(`Failed to send password reset email to ${toEmail}: ${error.message}`);
    if (error.response) {
      log(`SMTP response: ${error.response}`);
    }
    throw error;
  }
};
