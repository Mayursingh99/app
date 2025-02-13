require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/api/update-metadata', async (req, res) => {
    const { url, title, description } = req.body;

    if (!url || !title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const response = await axios.put(
            `https://api.webflow.com/sites/${process.env.WEBFLOW_SITE_ID}/pages`,
            {
                url,
                metaTitle: title,
                metaDescription: description,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
                    'accept-version': '1.0.0',
                },
            }
        );
        return res.status(200).json({ message: 'Metadata updated successfully' });
    } catch (error) {
        console.error('Webflow API Error:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Error updating metadata', error: error.message });
    }
});

// Set port dynamically for Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
