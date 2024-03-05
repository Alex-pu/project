const express = require('express');
const mysql = require('mysql');
const path = require('path');
//pay dependancies
const cors =require ('cors');
require('dotenv').config();
const app = express();
const port = 5000;
app.use(express.static(path.join(__dirname, 'public')));

// express middleware that convert request body to JSON.payment
app.use(express.json())
app.use(cors())
// import routes
//import lipaNaMpesaRoutes from "./routes/routes.lipanampesa.js"
const lipaNaMpesaRoutes = require('./routes/routes.lipanampesa');
//app.use('/api',lipaNaMpesaRoutes)
app.use(express.json());
app.use('/api', lipaNaMpesaRoutes);
//pay dep
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/post_images/', // Path to store uploaded images
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage
});

// Set storage engine for comment images
const commentStorage = multer.diskStorage({
    destination: './public/uploads/', // Path to store uploaded comment images
    filename: function(req, file, cb) {
        // Use the post ID as the filename for the comment image
        const postId = req.body.postId; // Assuming you have postId available in the request body
        const extension = path.extname(file.originalname);
        cb(null, postId + extension);
    }
});

    


// Init Upload for comment images
const uploadComment = multer({
    storage: commentStorage
});







// Create connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'missing'
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Set up routes
app.get('/', (req, res) => {
    // Query all posts from the 'posts' table
    connection.query('SELECT * FROM posts', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving posts: ' + error);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Render the home template and pass the posts data
        res.render('home', { posts: results });
    });
});

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// payment form 
app.get('/payment', (req, res) => {
    res.render('payment.ejs');
});

// uploading posts
app.get('/create-post', (req, res) => {
    res.render('create-post');
});


app.post('/create-post', upload.single('image'), (req, res) => {
    // Get the image file path
    const imagePath = req.file.path.replace('public/', '');
    
    // Extract other form fields
    const { description } = req.body;

    // Insert the post data into the database
    connection.query('INSERT INTO posts (image, description) VALUES (?, ?)', [imagePath, description], (error, results, fields) => {
        if (error) {
            console.error('Error inserting post:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Redirect to home page after successful submission
        res.redirect('/');
    });
});

app.post('/comment', uploadComment.single('commentImage'), (req, res) => {
    // Logic to handle uploaded comment image
    res.send('Comment image uploaded successfully');
});
// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

