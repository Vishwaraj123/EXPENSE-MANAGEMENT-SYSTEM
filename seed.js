// ./seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Director = require('./models/Director'); // Assuming you have a User model
const users = require('./data/users');

dotenv.config();

async function seedDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        console.log('Seeding database...', users);
        // await User.deleteMany(); // Delete existing users
        await Director.insertMany(users); // Insert new users
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedDB();
