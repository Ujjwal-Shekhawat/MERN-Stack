const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Conect to database
connectDB();

// Middelware for POST requests (I am using google ARC for testing post requests)
app.use(express.json({ exteded: false }));

app.get('/', (req, res) => res.send('API running'));
app.use('/api/users', require('./routes/api/users')); // Runs the same code as the above line which is defined in another .js file
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profiles', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server started successfully ${PORT}'));
