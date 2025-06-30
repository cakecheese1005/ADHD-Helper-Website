const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');
const frontendPath = path.join(__dirname, '../frontend');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(frontendPath));

// Utility: Load users from file
function loadUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("⚠️ Error reading users.json:", error.message);
        return [];
    }
}

// Utility: Save users to file
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error("⚠️ Error writing to users.json:", error.message);
    }
}

// Routes - Frontend pages
app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(frontendPath, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(frontendPath, 'register.html')));

// API: Get random movie quote
app.get('/api/quote', (req, res) => {
    const quotes = [
        "“Do, or do not. There is no try.” – *Yoda*, Star Wars",
        "“Life is not the amount of breaths you take...” – *Hitch*, Hitch",
        "“Just keep swimming.” – *Dory*, Finding Nemo",
        "“To infinity and beyond!” – *Buzz Lightyear*, Toy Story"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote });
});

// API: Register user
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const users = loadUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    users.push({ name, email, password });
    saveUsers(users);

    res.status(201).json({ message: 'Registered successfully.' });
});

// API: Login user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
    } else {
        res.status(401).json({ error: 'Invalid credentials.' });
    }
});

// Fallback for frontend routes only (prevents path-to-regexp error)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
