
import nodemailer from 'nodemailer';

// Simple logger function for demonstration (replace with real logger if available)
const log = (message) => {
  console.log(`[otpService] ${new Date().toISOString()} - ${message}`);
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
        console.log(`SMTP Loaded in environment variable`);
      // console.log(`${varName} environment variable: ${process.env[varName]}`);
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
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
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
 * Send OTP email to the specified recipient
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - OTP code to send
 */
export const sendOtpEmail = async (toEmail, otp) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: toEmail,
    subject: 'Your OTP Verification Code',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    log(`OTP email sent successfully to ${toEmail}`);
  } catch (error) {
    log(`Failed to send OTP email to ${toEmail}: ${error.message}`);
    if (error.response) {
      log(`SMTP response: ${error.response}`);
    }
    throw error;
  }
};
