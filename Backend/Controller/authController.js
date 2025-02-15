const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Google Authentication (Signup/Login)
exports.googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        // Decode the token to get the user's data
        const decodedToken = jwt.decode(token);

        // Extract necessary information from the decoded token
        const { email, name, picture: profile_picture, sub: googleId } = decodedToken;

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
            // If the user doesn't exist, create a new user
            user = await User.create({ name, email, googleId, profile_picture, role: 'user' });
        }

        // Generate a JWT token for the authenticated user
        const newToken = generateToken(user);

        // Send back the user data and token in the response
        res.status(200).json({ success: true, user, token: newToken });
    } catch (error) {
        console.error('Error authenticating with Google:', error);
        res.status(500).json({ success: false, message: 'Error authenticating with Google.', error });
    }
};
