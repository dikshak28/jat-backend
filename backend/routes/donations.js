const express = require("express");
const router = express.Router();
const generateReceipt = require("../utils/generateReceipt");  // Import receipt function
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// 🚀 Donation Route
router.post("/donate", async (req, res) => {
    try {
        const { name, email, amount, transactionId, phone } = req.body;
        
        const date = new Date().toISOString().split("T")[0];

        const donationSchema = new mongoose.Schema({
            name: String,
            email: String,
            phone: String,
            amount: Number,
            transactionId: String,
          });
          
          const Donation = mongoose.model('Donation', donationSchema);
        

        // ✅ Step 1: Generate receipt
        generateReceipt(name, amount, date, transactionId);

        // ✅ Step 2: Define where the receipt is stored
        const receiptPath = path.join(__dirname, `../receipts/receipt_${transactionId}.pdf`);

        // ✅ Step 3: Send the receipt via email
        await sendEmailWithReceipt(email, receiptPath);

        res.status(200).json({ message: "Donation successful. Receipt sent!" });
    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ message: "Error processing donation" });
    }
});

// ✅ Email Sending Function
async function sendEmailWithReceipt(email, receiptPath) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com", // Replace with your email
            pass: "your-email-password", // Replace with App Password
        },
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Donation Receipt - Jeevan Ankur Trust",
        text: "Thank you for your donation! Your receipt is attached.",
        attachments: [{ filename: "receipt.pdf", path: receiptPath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Receipt email sent to:", email);
}

module.exports = router;
