// Example Node.js + Express endpoint
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        const geminiResponse = await fetch('https://api.generative.google.com/v1beta2/models/text-bison-001:generateText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` // Keep your key secret in env
            },
            body: JSON.stringify({
                prompt: message,
                temperature: 0.7,
                maxOutputTokens: 500
            })
        });

        const data = await geminiResponse.json();
        const reply = data?.candidates?.[0]?.content || 'No response from Gemini';

        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: 'Error generating AI response' });
    }
});

export default router;
