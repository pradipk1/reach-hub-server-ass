
const mongoose = require('mongoose');

async function connectDatabase() {
    const result = await mongoose.connect('mongodb+srv://pradipshukla12699:pradip123@cluster0.js4onun.mongodb.net/');

    return result;
}

module.exports = connectDatabase;