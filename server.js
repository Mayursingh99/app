const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();  // To load environment variables like API key and site ID

const app = express();

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Your route to handle metadata update via POST or PUT
app.put('/update-metadata', async (req, res) => {
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
});

// Start the server
app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
