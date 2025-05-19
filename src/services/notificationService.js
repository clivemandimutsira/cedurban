const notificationModel = require('../models/notificationModel');
const { getIO } = require('../sockets/websocket');
const nodemailer = require('nodemailer');
const Twilio = require('twilio');
require('dotenv').config();

// Email transporter (using Gmail or SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'SendGrid', 'Mailgun', etc. or use host/port instead
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter failed:', error);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

// Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Core notification function
async function sendNotification(memberId, title, message, { viaEmail = false, viaSms = false } = {}) {
  const newNotif = await notificationModel.create(memberId, title, message);
  console.log(`📨 DB saved notification ${newNotif.id} for ${memberId}`);

  // In-app emit
  const io = getIO();
  io.to(`member_${memberId}`).emit('new_notification', newNotif);
  console.log(`🚀 Emitted new_notification to member_${memberId}`);

  // Email
  if (viaEmail && newNotif.member_email) {
    await sendEmail({
      to: newNotif.member_email,
      subject: title,
      html: `<p>${message}</p>`
    });
    console.log(`✉️  Email sent to ${newNotif.member_email}`);
  }

  // SMS
  if (viaSms && newNotif.member_phone) {
    await sendSms(newNotif.member_phone, message);
    console.log(`📱 SMS sent to ${newNotif.member_phone}`);
  }

  return newNotif;
}

// ✅ Updated sendEmail to accept an object
async function sendEmail({ to, subject, html }) {
  if (!to || typeof to !== 'string') {
    throw new Error('Invalid recipient email address');
  }

  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    throw err;
  }
}

// Send SMS
async function sendSms(to, body) {
  try {
    const msg = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log('✅ SMS sent:', msg.sid);
    return msg;
  } catch (err) {
    console.error('❌ SMS send failed:', err.message);
    throw err;
  }
}

module.exports = { sendNotification, sendEmail, sendSms };
