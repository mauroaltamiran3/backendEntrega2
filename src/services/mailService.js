import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export const sendPurchaseMail = async (to, subject, html) => {
  return await transport.sendMail({
    from: `Ecommerce <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  });
};
