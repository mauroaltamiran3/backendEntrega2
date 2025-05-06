import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export const sendPurchaseMail = async (to, subject, html) => {
  try {
    const result = await transporter.sendMail({
      from: `"Ecommerce" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log('📧 Correo enviado con éxito:', result.messageId);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
  }
};
