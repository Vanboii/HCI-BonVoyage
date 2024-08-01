const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/save-trip-details', (req, res) => {
  const tripDetails = req.body;
  const filePath = path.join(__dirname, 'tripDetails.json');

  fs.writeFile(filePath, JSON.stringify(tripDetails, null, 2), (err) => {
    if (err) {
      console.error('Error saving trip details:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Trip details saved successfully');
  });
});

app.get('/get-trip-url', (req, res) => {
  const filePath = path.join(__dirname, 'tripDetails.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading trip details:', err);
      return res.status(500).send('Internal Server Error');
    }

    const tripDetails = JSON.parse(data);
    const city = tripDetails.city.toLowerCase().replace(/ /g, '');
    const country = tripDetails.country.toLowerCase().replace(/ /g, '');

    const formattedUrl = `http://127.0.0.1:3000/get-activities?city=${city}&country=${country}`;
    res.status(200).json({ url: formattedUrl });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
