const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendQuotationEmail = async (quotation, pdfBuffer) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Your Company'}" <${process.env.SMTP_USER}>`,
      to: quotation.client.email,
      subject: `Quotation #${quotation.quotationNumber} from ${process.env.COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #4F46E5; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quotation</h1>
            </div>
            <div class="content">
              <p>Dear ${quotation.client.name},</p>
              <p>Thank you for the opportunity to submit this quotation. Please find the details below:</p>
              
              <div class="details">
                <p><strong>Quotation Number:</strong> ${quotation.quotationNumber}</p>
                <p><strong>Date:</strong> ${new Date(quotation.createdAt).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> ${new Date(quotation.validUntil).toLocaleDateString()}</p>
                <p class="amount">Total: $${quotation.total.toFixed(2)}</p>
              </div>
              
              <p>Please review the attached quotation document for complete details.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <a href="#" class="button">View Online</a>
            </div>
            <div class="footer">
              <p>This email was sent by ${process.env.COMPANY_NAME || 'Your Company'}</p>
              <p>© ${new Date().getFullYear()} All rights reserved</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Quotation-${quotation.quotationNumber}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendInvoiceEmail = async (invoice, pdfBuffer) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Your Company'}" <${process.env.SMTP_USER}>`,
      to: invoice.client.email,
      subject: `Invoice #${invoice.invoiceNumber} from ${process.env.COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; }
            .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
            </div>
            <div class="content">
              <p>Dear ${invoice.client.name},</p>
              <p>Please find your invoice details below:</p>
              
              <div class="details">
                <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                <p class="amount">Total: $${invoice.total.toFixed(2)}</p>
              </div>
              
              <p>Please find the complete invoice attached to this email.</p>
              <p>We appreciate your business!</p>
              
              <a href="#" class="button">Pay Online</a>
            </div>
            <div class="footer">
              <p>This email was sent by ${process.env.COMPANY_NAME || 'Your Company'}</p>
              <p>© ${new Date().getFullYear()} All rights reserved</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendQuotationEmail, sendInvoiceEmail };