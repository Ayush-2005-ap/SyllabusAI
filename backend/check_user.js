const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const email = 'apayush.20@gmail.com';
        const user = await User.findOne({ email });
        
        if (user) {
            console.log('User found:', user.name, user.email);
        } else {
            console.log('User NOT found:', email);
        }
        
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.connection.close();
    }
};

checkUser();
