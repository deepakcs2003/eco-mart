const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConnect = require('./Config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/AuthRoutes'); 
const scrapeRoutes = require('./Routes/scrapeRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const wishlistRoutes = require('./Routes/wishlistRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/scrape',scrapeRoutes);
app.use('/api/v1/categories',categoryRoutes)
app.use('/api/v1/wishlist',wishlistRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Eco-Mart API Home Page!');
});

const PORT = process.env.PORT || 8000;
dbConnect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => console.error('Database connection failed:', error));
