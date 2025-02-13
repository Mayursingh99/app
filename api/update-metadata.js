import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { url, title, description } = req.body;

    if (!url || !title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Webflow API request
        const response = await axios.patch(
            `https://api.webflow.com/sites/${process.env.WEBFLOW_SITE_ID}/pages`,
            {
                metaTitle: title,
                metaDescription: description
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
                    "accept-version": "1.0.0"
                }
            }
        );

        res.status(200).json({ message: 'Metadata updated successfully' });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message || error);
        res.status(500).json({
            message: 'Error updating metadata',
            error: error.response?.data || error.message
        });
    }
}
