
const express = require('express');
const connectDatabase = require('./database/connectDatabase');
const cors = require('cors');
const axios = require('axios');
const { User } = require('./database/User');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {

    
    return res.send('Hello there!');
});


app.get('/top-players', async (req, res) => {
    const players = await User.find().limit(50);

    return res.send(players);
});


app.get('/player/:username/rating-history', async (req, res) => {

    const username = req.params.username;
    const ratingHistory = await axios.get(`https://lichess.org/api/user/${username}/rating-history`);
    // console.log(ratingHistory.data);

    return res.send(ratingHistory.data);
})


app.get('/players/rating-history-csv', async (req, res) => {
    const players = await User.find().limit(50);
    
    let users = [];
    for(let i=0;i<50; i++) {
        const { username, rating } = players[i];
        users.push({ username, rating });
    }
    // console.log(users);
    
    // const data = [
    //     { name: 'John Doe', age: 30, city: 'New York' },
    //     { name: 'Jane Doe', age: 25, city: 'San Francisco' },
    //     // Add more objects as needed
    // ];

    // Specify the CSV file path
    const csvFilePath = 'output.csv';

    // Create CSV writer
    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: Object.keys(users[0]).map(key => ({ id: key, title: key })),
    });

    // Write the csv file
    csvWriter.writeRecords(users)
    .then(() => {
        console.log('CSV file written successfully');

        // Set response headers for CSV file download
        res.attachment('output.csv');

        // Stream the CSV file as the response
        const fileStream = fs.createReadStream(csvFilePath);
        fileStream.pipe(res);

        // Read the CSV file and send it as a response, for example
        // const csvData = fs.readFileSync(csvFilePath, 'utf8');

        // console.log(csvData);

        // You can also delete the CSV file after sending it
        // fs.unlinkSync(csvFilePath);

        // Optionally, you can delete the CSV file after sending it
        fileStream.on('end', () => fs.unlinkSync(csvFilePath));
    })
    .catch(error => {
        console.error('Error writing CSV file:', error);
        res.status(500).send('Internal Server Error');
    });

})


const port = process.argv[2] || 8080;

connectDatabase()
.then(() => {
    app.listen(port, () => {
        console.log(`Server listening to http requests on http://localhost:${port}`);
    });
});