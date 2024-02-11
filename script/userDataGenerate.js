
const connectDatabase = require('../database/connectDatabase');
const { User } = require('../database/User');
const axios = require('axios');



async function generateUserData() {
    const res = await axios.get('https://lichess.org/api/player/top/100/classical');
    let users = res.data.users;
    console.log(users);
    let dbUsers = [];

    for(let i=0; i<100; i++) {
        
        const user = {
            username: users[i].username,
            rating: users[i].perfs.classical.rating
        }

        dbUsers.push(user);
    }

    User.insertMany(dbUsers);
}

connectDatabase()
.then(() => {
    generateUserData();
})