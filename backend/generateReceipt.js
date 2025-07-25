const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateReceipt(name, amount, date, transactionId) {
    const receiptsDir = path.join(__dirname, "receipts");

    // ✅ Check if "receipts" folder exists, if not, create it
    if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir);
    }

    const filePath = path.join(receiptsDir, `receipt_${transactionId}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Add content to PDF
    doc.fontSize(18).text("Jeevan Ankur Trust", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Receipt for Donation`, { align: "center" });
    doc.moveDown();
    
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Amount: ₹${amount}`);
    doc.text(`Date: ${date}`);
    doc.text(`Transaction ID: ${transactionId}`);
    
    doc.moveDown();
    doc.text("Thank you for your support!", { align: "center" });

    doc.end();
    
    console.log(`✅ Receipt generated successfully: ${filePath}`);
}

// Example usage
generateReceipt("Sanika", 500, "2025-03-25", "TXN12345");
