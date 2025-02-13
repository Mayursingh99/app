const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {  // <-- This should be POST
    try {
        const { url, title, description } = req.body;

        if (!url || !title || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        res.status(200).json({ message: 'Metadata updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating metadata' });
    }
});

module.exports = router;