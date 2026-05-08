const PDFDocument = require('pdfkit');

const generateQuotationPDF = (quotation, companyInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push);
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('QUOTATION', { align: 'center' });
      doc.moveDown();
      
      // Company Info
      doc.fontSize(12).font('Helvetica-Bold').text(companyInfo.name || 'Your Company');
      doc.fontSize(10).font('Helvetica').text(companyInfo.address || '');
      doc.text(companyInfo.email || '');
      doc.text(companyInfo.phone || '');
      doc.moveDown();

      // Quotation Details
      doc.fontSize(12).font('Helvetica-Bold').text(`Quotation #: ${quotation.quotationNumber}`);
      doc.fontSize(10).font('Helvetica').text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`);
      doc.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`);
      doc.moveDown();

      // Client Info
      doc.fontSize(12).font('Helvetica-Bold').text('Bill To:');
      doc.fontSize(10).font('Helvetica').text(quotation.client.name);
      if (quotation.client.company) doc.text(quotation.client.company);
      doc.text(quotation.client.email);
      if (quotation.client.address) doc.text(quotation.client.address);
      doc.moveDown();

      // Items Table
      const tableTop = doc.y;
      const tableHeaders = ['Description', 'Qty', 'Unit Price', 'Total'];
      const columnWidths = [250, 60, 100, 80];
      
      // Draw table header
      doc.font('Helvetica-Bold').fontSize(10);
      let xPosition = 50;
      tableHeaders.forEach((header, i) => {
        doc.text(header, xPosition, tableTop, { width: columnWidths[i], align: i > 1 ? 'right' : 'left' });
        xPosition += columnWidths[i];
      });
      
      // Draw line
      doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
      
      // Draw items
      let yPosition = tableTop + 25;
      doc.font('Helvetica').fontSize(9);
      
      quotation.items.forEach(item => {
        xPosition = 50;
        doc.text(item.description, xPosition, yPosition, { width: columnWidths[0] });
        xPosition += columnWidths[0];
        doc.text(item.quantity.toString(), xPosition, yPosition, { width: columnWidths[1], align: 'center' });
        xPosition += columnWidths[1];
        doc.text(`$${item.unitPrice.toFixed(2)}`, xPosition, yPosition, { width: columnWidths[2], align: 'right' });
        xPosition += columnWidths[2];
        doc.text(`$${item.total.toFixed(2)}`, xPosition, yPosition, { width: columnWidths[3], align: 'right' });
        yPosition += 20;
      });

      // Totals
      yPosition += 10;
      doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;
      
      doc.font('Helvetica').fontSize(10);
      doc.text('Subtotal:', 350, yPosition, { width: 100, align: 'right' });
      doc.text(`$${quotation.subtotal.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
      yPosition += 20;
      
      doc.text(`Tax (${quotation.taxRate}%):`, 350, yPosition, { width: 100, align: 'right' });
      doc.text(`$${quotation.tax.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
      yPosition += 20;
      
      doc.font('Helvetica-Bold');
      doc.text('Total:', 350, yPosition, { width: 100, align: 'right' });
      doc.text(`$${quotation.total.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });

      // Notes & Terms
      if (quotation.notes) {
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(10).text('Notes:');
        doc.font('Helvetica').fontSize(9).text(quotation.notes);
      }

      if (quotation.terms) {
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(10).text('Terms & Conditions:');
        doc.font('Helvetica').fontSize(9).text(quotation.terms);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).font('Helvetica').text(
        `Generated on ${new Date().toLocaleString()}`,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateInvoicePDF = (invoice, companyInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push);
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Company Info
      doc.fontSize(12).font('Helvetica-Bold').text(companyInfo.name || 'Your Company');
      doc.fontSize(10).font('Helvetica').text(companyInfo.address || '');
      doc.text(companyInfo.email || '');
      doc.text(companyInfo.phone || '');
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12).font('Helvetica-Bold').text(`Invoice #: ${invoice.invoiceNumber}`);
      doc.fontSize(10).font('Helvetica').text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
      if (invoice.quotationNumber) {
        doc.text(`Reference Quotation: ${invoice.quotationNumber}`);
      }
      doc.moveDown();

      // Client Info
      doc.fontSize(12).font('Helvetica-Bold').text('Bill To:');
      doc.fontSize(10).font('Helvetica').text(invoice.client.name);
      if (invoice.client.company) doc.text(invoice.client.company);
      doc.text(invoice.client.email);
      if (invoice.client.address) doc.text(invoice.client.address);
      doc.moveDown();

      // Items Table (same structure as quotation)
      const tableTop = doc.y;
      const tableHeaders = ['Description', 'Qty', 'Unit Price', 'Total'];
      const columnWidths = [250, 60, 100, 80];
      
      doc.font('Helvetica-Bold').fontSize(10);
      let xPosition = 50;
      tableHeaders.forEach((header, i) => {
        doc.text(header, xPosition, tableTop, { width: columnWidths[i], align: i > 1 ? 'right' : 'left' });
        xPosition += columnWidths[i];
      });
      
      doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
      
      let yPosition = tableTop + 25;
      doc.font('Helvetica').fontSize(9);
      
      invoice.items.forEach(item => {
        xPosition = 50;
        doc.text(item.description, xPosition, yPosition, { width: columnWidths[0] });
        xPosition += columnWidths[0];
        doc.text(item.quantity.toString(), xPosition, yPosition, { width: columnWidths[1], align: 'center' });
        xPosition += columnWidths[1];
        doc.text(`$${item.unitPrice.toFixed(2)}`, xPosition, yPosition, { width: columnWidths[2], align: 'right' });
        xPosition += columnWidths[2];
        doc.text(`$${item.total.toFixed(2)}`, xPosition, yPosition, { width: columnWidths[3], align: 'right' });
        yPosition += 20;
      });

      // Totals
      yPosition += 10;
      doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;
      
      doc.font('Helvetica').fontSize(10);
      doc.text('Subtotal:', 350, yPosition, { width: 100, align: 'right' });
      doc.text(`$${invoice.subtotal.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
      yPosition += 20;
      
      doc.text(`Tax (${invoice.taxRate}%):`, 350, yPosition, { width: 100, align: 'right' });
      doc.text(`$${invoice.tax.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
      yPosition += 20;
      
      doc.font('Helvetica-Bold');
      doc.text('Total:', 350, yPosition, { width: 100, align: 'right' });
      doc.text(`$${invoice.total.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });

      // Notes & Terms
      if (invoice.notes) {
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(10).text('Notes:');
        doc.font('Helvetica').fontSize(9).text(invoice.notes);
      }

      if (invoice.terms) {
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(10).text('Terms & Conditions:');
        doc.font('Helvetica').fontSize(9).text(invoice.terms);
      }

      // Payment Status
      doc.moveDown(2);
      const statusColor = invoice.status === 'paid' ? '#059669' : '#D97706';
      doc.fontSize(12).fillColor(statusColor).text(
        `Status: ${invoice.status.toUpperCase()}`,
        { align: 'center' }
      );

      // Footer
      doc.moveDown();
      doc.fontSize(8).font('Helvetica').fillColor('#666666').text(
        `Generated on ${new Date().toLocaleString()} | Invoice #${invoice.invoiceNumber}`,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateQuotationPDF, generateInvoicePDF };