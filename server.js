const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3017;

const app = express();
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }));
mongoose.connect(`mongodb+srv://mritunjaykaushik1803:KxIsVQFID7PJTuTz@cluster1.8nsmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection
db.once('open', () => {
    console.log("Connected to MongoDB");
});
const detailsSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    fathername:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    district:{
        type: String,
        required: true
    }
});
const Details = mongoose.model('Details', detailsSchema);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/submit', async (req, res) => {
    try {
        // Log incoming request data to debug
        console.log("Request Body:", req.body);

        // Create a new Details document using the incoming request body data
        const details = new Details({
            fullName: req.body.fullName,
            fathername: req.body.fathername,
            email: req.body.email,
            phone: parseInt(req.body.phone),  // Ensure phone is a number
            dob: new Date(req.body.dob),  // Ensure dob is a date
            gender: req.body.gender,
            address: req.body.address,
            district: req.body.district,
            state: req.body.state
        });

        // Save the document to the database
        const savedDetails = await details.save();
        res.status(201).render('details.ejs', { details: savedDetails });
        console.log("Details saved to database");
    } catch (error) {
        // Log specific error messages for debugging
        console.error("Error saving details:", error.errors ? error.errors.fullName.message : error.message);
        if (error.code === 11000) {
            res.status(400).send("Duplicate email or phone number. Please use a unique value.");
        } else {
            res.status(400).send(`Error: ${error.message}`);
        }
    }
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    
});
