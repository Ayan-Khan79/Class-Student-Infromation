const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const isProduction = process.env.NODE_ENV === 'production';


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
    connectionString: isProduction
    ? process.env.DATABASE_URL // Set DATABASE_URL to your Render database URI in your .env
    : 'postgresql://postgres:Ayan7905@localhost:5432/student_management',
    user: isProduction ? process.env.DB_USER : 'postgres',
    host: isProduction ? process.env.DB_HOST : 'localhost',
    database: isProduction ? process.env.DB_DATABASE : 'student_management',
    password: isProduction ? process.env.DB_PASSWORD : 'Ayan7905@',
    port: isProduction ? process.env.DB_PORT : 5432,
    ssl: isProduction ? { rejectUnauthorized: false } : false 
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

// Root route to serve landing.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
}); 

app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aboutus.html')); // Ensure you have aboutus.html in the public directory
});

app.get('/home', (req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/services', (req,res) => {
    res.sendFile(path.join(__dirname,'public','services.html'));
});

app.get('/learnmore', (req,res) => {
    res.sendFile(path.join(__dirname,'public','learnmore.html'));
});

app.get('/contact', (req,res) => {
    res.sendFile(path.join(__dirname,'public','contact.html'));
});

app.get('/getstarted', (req,res) => {
    res.sendFile(path.join(__dirname,'public','main.html'));
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
