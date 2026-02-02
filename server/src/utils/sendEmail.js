const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // Default or Mock
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_EMAIL || 'user',
            pass: process.env.SMTP_PASSWORD || 'pass'
        }
    });

    // Send the email
    const message = {
        from: `${process.env.FROM_NAME || 'Trackify'} <${process.env.FROM_EMAIL || 'noreply@trackify.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: options.html // Can add HTML later
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
