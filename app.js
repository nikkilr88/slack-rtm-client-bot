const express = require('express');
const app = express();
const Bot = require('./config/bot-config');
const port = process.env.PORT || 3000;

Bot();

// Start server
app.listen((port), () => {
    console.log(`server started on port ${port}`);
});