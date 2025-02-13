const axios = require('axios');

// Enable dotenv for local testing (if needed)
require('dotenv').config();

// Read Webflow API key and Site ID from environment variables
const API_KEY = process.env.WEBFLOW_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Handle the API request
module.exports = async (req, res) => {
  // Ensure we are handling POST requests
  if (req.method === 'POST') {
    const { url, title, description } = req.body;

    // Check for missing fields
    if (!url || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Make the Webflow API request
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

      // Send success response
      return res.status(200).json({ message: 'Metadata updated successfully' });
    } catch (error) {
      console.error('Webflow API error:', error.response || error.message);
      return res.status(500).json({ message: 'Error updating metadata', error: error.message });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
