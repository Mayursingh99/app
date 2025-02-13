const express = require('express');
const axios = require('axios');
const cors = require('cors'); // ✅ Added CORS support
const bodyParser = require('body-parser');
require('dotenv').config(); // ✅ Ensure environment variables are loaded

const app = express();

// Read Webflow API key and Site ID from environment variables
const API_KEY = process.env.WEBFLOW_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

app.use(cors()); // ✅ Allow frontend requests
app.use(bodyParser.json());

// ✅ Webflow API needs a valid page ID instead of just URL
async function getPageId(url) {
    try {
        const response = await axios.get(`https://api.webflow.com/sites/${SITE_ID}/pages`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "accept-version": "1.0.0"
            }
        });

        const pages = response.data.pages || [];
        const page = pages.find(p => p.url === url);
        return page ? page._id : null;
    } catch (error) {
        console.error("Error fetching pages:", error);
        return null;
    }
}

// Endpoint to handle metadata update
app.post('/update-metadata', async (req, res) => {
    const { url, title, description } = req.body;

    if (!url || !title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // ✅ Fetch the correct page ID for the given URL
        const pageId = await getPageId(url);
        if (!pageId) {
            return res.status(404).json({ message: 'Page not found in Webflow' });
        }

        // ✅ Update metadata using the correct Webflow API endpoint
        const response = await axios.patch(
            `https://api.webflow.com/sites/${SITE_ID}/pages/${pageId}`,
            {
                "metaTitle": title,
                "metaDescription": description
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "accept-version": "1.0.0",
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(200).json({ message: 'Metadata updated successfully' });
    } catch (error) {
        console.error("Metadata update error:", error.response?.data || error);
        res.status(500).json({ message: 'Error updating metadata' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
