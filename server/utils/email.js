import nodemailer from 'nodemailer';
 
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
  });
};
 
export const sendAccountVerificationEmail = async (email, name, otpCode) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Welcome to Evently!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for registering. To complete your account activation, please use the 6-digit One-Time Password (OTP) below. This code is valid for 10 minutes.</p>
      <div style="background-color: #f8fafc; border: 2px dashed #4f46e5; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e1b4b; margin: 20px 0;">
        ${otpCode}
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center;">If you did not request this account registration, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Evently Operations" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Evently Account",
    html: htmlContent,
  });
};
 
export const sendBookingVerificationEmail = async (email, name, eventTitle, otpCode) => {
  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0d9488; text-align: center;">Authorize Your Ticket Booking</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We received a ticket reservation request for the event: <strong>${eventTitle}</strong>.</p>
      <p>To verify your identity and proceed directly to payment checkout, please enter this security OTP code within 5 minutes:</p>
      <div style="background-color: #f0fdfa; border: 2px solid #0d9488; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #115e59; margin: 20px 0;">
        ${otpCode}
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center;">This code ensures your ticket allocations are safely secured before card checkout.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Evently Booking Desk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Verify Booking for ${eventTitle}`,
    html: htmlContent,
  });
};
 
export const sendPaymentSuccessEmail = async (email, name, bookingDetails) => {
  const transporter = createTransporter();
  const { eventTitle, date, time, location, seatsBooked, totalPrice, transactionId } = bookingDetails;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
        <span style="background-color: #dcfce7; color: #15803d; padding: 6px 16px; border-radius: 9999px; font-weight: bold; font-size: 14px;">Payment Confirmed</span>
        <h2 style="color: #1e1b4b; margin-top: 10px;">Your Ticket is Secured! 🎉</h2>
      </div>
      
      <p style="margin-top: 20px;">Hi <strong>${name}</strong>,</p>
      <p>Your payment went through successfully. Below are your official event ticket details:</p>
      
      <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px;">${eventTitle}</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 30%;">Date / Time:</td>
            <td style="padding: 6px 0;">${date} at ${time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Location:</td>
            <td style="padding: 6px 0;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Seats Booked:</td>
            <td style="padding: 6px 0;">${seatsBooked} Ticket(s)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Total Paid:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #16a34a;">$${totalPrice}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #94a3b8;">Transaction:</td>
            <td style="padding: 6px 0; color: #94a3b8; font-family: monospace;">${transactionId}</td>
          </tr>
        </table>
      </div>
      
      <p style="text-align: center; font-size: 14px; color: #4f46e5; font-weight: bold;">Present this confirmation email at the venue entrance.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Evently Tickets" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Ticket Confirmed: ${eventTitle}`,
    html: htmlContent,
  });
};