const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors'); // To allow requests from your static site

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Get sensitive keys from environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/send-message', async (req, res) => {
    const { name, phone, email, message } = req.body;

    const telegramMessage = `
📩 <b>New Contact Form Submission</b>
👤 <b>Name:</b> ${name}
📞 <b>Phone:</b> ${phone || 'Not provided'}
📧 <b>Email:</b> ${email}
💬 <b>Message:</b>
${message}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (result.ok) {
            res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send message.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
