require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const WEBFLOW_API_KEY = process.env.WEBFLOW_API_KEY;
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID; // Set this in your Vercel environment

// Update Webflow CMS Metadata
app.put("/update-metadata", async (req, res) => {
    try {
        const { itemId, title, description } = req.body;

        if (!itemId || !title || !description) {
            return res.status(400).json({ error: "Missing required fields: itemId, title, description" });
        }

        const response = await axios.patch(
            `https://api.webflow.com/collections/${WEBFLOW_COLLECTION_ID}/items/${itemId}`,
            {
                fields: {
                    name: title, // Webflow CMS requires a 'name' field
                    metaTitle: title, // Make sure these fields exist in your CMS collection
                    metaDescription: description
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${WEBFLOW_API_KEY}`,
                    "accept-version": "1.0.0",
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Error updating metadata:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
