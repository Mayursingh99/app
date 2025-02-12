const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

// Replace with your Webflow API key and site ID
const API_KEY = '5f385401713fe6cdf74f8ebf31ebfee3e38719dfb11200e2058a030fdd5b85fb';
const SITE_ID = '67ac8d7653315213e7829798';

// Endpoint to handle metadata update
app.post('/update-metadata', async (req, res) => {
    const { url, title, description } = req.body;

    if (!url || !title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Make a request to Webflow API to update metadata
        const response = await axios.put(
            `https://api.webflow.com/sites/${SITE_ID}/pages`,
            {
                "url": url,
                "metaTitle": title,
                "metaDescription": description
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "accept-version": "1.0.0"
                }
            }
        );

        res.status(200).json({ message: 'Metadata updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating metadata' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
