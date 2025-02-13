// api/update-metadata.js
const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method === 'PUT') {
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
      console.error(error);
      return res.status(500).json({ message: 'Error updating metadata' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
