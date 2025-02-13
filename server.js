const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// PUT request handler to update metadata
app.put('/update-metadata', async (req, res) => {
  const { itemId, title, description } = req.body;

  // Check if all required fields are provided
  if (!itemId || !title || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Make a request to Webflow API to update metadata
    const response = await axios.put(
      `https://api.webflow.com/cms/collections/${process.env.WEBFLOW_COLLECTION_ID}/items/${itemId}`,
      {
        fields: {
          name: title, // Update page title
          metaTitle: title, // Meta title field
          metaDescription: description // Meta description field
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
          'accept-version': '1.0.0',
        },
      }
    );

    // Check if the request was successful
    if (response.status === 200) {
      res.status(200).json({ message: 'Metadata updated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to update metadata' });
    }

  } catch (error) {
    console.error('Error updating metadata:', error);
    res.status(500).json({ message: 'Error updating metadata' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
