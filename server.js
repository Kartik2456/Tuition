const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

// 1. Initialize Firebase using the Environment Variable (Fixes the 'serviceAccountKey.json' error)
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase connected successfully!");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const db = admin.firestore();

app.use(express.json());
app.use(express.static('public'));

// 2. Main Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. API Route to save student data (Restored)
app.post('/api/students', async (req, res) => {
    try {
        const studentData = req.body;
        const docRef = await db.collection('students').add(studentData);
        res.status(200).send({ id: docRef.id, message: 'Student added successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 4. API Route to fetch students (Restored)
app.get('/api/students', async (req, res) => {
    try {
        const snapshot = await db.collection('students').get();
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(students);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 5. Start Server (Uses Render's Port)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});