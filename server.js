const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files from the public directory
app.use('/uploads', express.static('uploads')); // Serve uploaded images

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp
    }
});
const upload = multer({ storage: storage });

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_management',
    password: 'Ayan7905@',
    port: 5432,
});

pool.connect();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded



// POST endpoint to register a student with an image
app.post('/registerStudent', upload.single('photo'), async (req, res) => {
    const { name, rollno, section, gmail } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null; // Get the image path

    try {
        const result = await pool.query(
            'INSERT INTO students (name, rollno, section, gmail, photo) VALUES ($1, $2, $3, $4, $5)',
            [name, rollno, section, gmail, photo]
        );
        res.status(201).json({
            success: true,
            message: 'Student registered successfully!',
            student: { name, rollno, section, gmail, photo }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database insertion failed' });
    }
});

// GET endpoint to retrieve all students
app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database retrieval failed' });
    }
});

// GET endpoint to search for students by name
app.get('/searchStudents', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    const { name } = req.query; // Get the name from the query parameters

    try {
        // Query to search for students by name (case-insensitive)
        const result = await pool.query(
            'SELECT * FROM students WHERE LOWER(name) LIKE $1',
            [`%${name.toLowerCase()}%`] // Use wildcard for partial matches
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database retrieval failed' });
    }
});

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
