const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint for YouTube downloads
app.post('/download/youtube', async (req, res) => {
    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(url, { filter: format => format.container === 'mp4' }).pipe(res);
    } catch (error) {
        res.status(500).send('Error downloading video');
    }
});

// Endpoint for Instagram downloads
app.post('/download/instagram', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('Invalid Instagram URL');
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const videoUrl = $('meta[property="og:video"]').attr('content');

        if (videoUrl) {
            res.redirect(videoUrl);
        } else {
            res.status(404).send('Video not found');
        }
    } catch (error) {
        res.status(500).send('Error downloading video from Instagram');
    }
});

// Add more endpoints for Facebook, Twitter, etc. following a similar approach

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});