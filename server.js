const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

// Read Webflow API key and Site ID from environment variables
const API_KEY = process.env.WEBFLOW_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Parse JSON bodies
app.use(bodyParser.json());

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
