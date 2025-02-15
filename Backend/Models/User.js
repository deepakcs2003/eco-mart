const mongoose = require('mongoose');

// Define the user schema for Google Authentication
const userSchema = new mongoose.Schema({
    googleId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    profile_picture: { 
        type: String 
    },
    role: {
        type: String,
        enum: ['general', 'admin','user'],  // Role can either be 'general' or 'admin'
        default: 'general'           // Default role is 'general'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Create model for User
module.exports = mongoose.model('User', userSchema);
