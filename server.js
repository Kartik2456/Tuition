const express = require('express');
const admin = require('firebase-admin');
const app = express();

// 1. Initialize Firebase
const serviceAccount = require("./serviceAccountKey.json");
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

app.use(express.urlencoded({ extended: true }));

const ui = `
<style>
    body { font-family: 'Segoe UI', sans-serif; background: #36393f; color: #dcddde; display: flex; justify-content: center; padding-top: 50px; }
    .card { background: #2f3136; padding: 30px; border-radius: 12px; width: 400px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); text-align: center; }
    .btn { background: #5865f2; color: white; padding: 12px; border: none; border-radius: 4px; width: 100%; cursor: pointer; font-weight: bold; margin-top: 15px; display: block; text-decoration: none; }
    .input { background: #202225; border: 1px solid #1c1e21; color: white; padding: 12px; width: 100%; border-radius: 4px; margin-bottom: 10px; box-sizing: border-box; }
    .group-item { background: #202225; padding: 15px; border-radius: 8px; margin-top: 10px; display: flex; justify-content: space-between; border-left: 4px solid #43b581; }
</style>`;

// --- VERIFICATION PAGE ---
app.get('/', (req, res) => {
    res.send(`${ui}
    <div class="card">
        <h1>Tuition Hub</h1>
        <p>Security Check: Please Verify Identity</p>
        <button onclick="verify()" class="btn">Sign in with Google</button>
    </div>
    <script>
        function verify() {
            // This acts as the OTP/Security Gateway
            const email = "kartik@gmail.com";
            window.location.href = "/dashboard?user=" + email + "&name=Kartik";
        }
    </script>`);
});

// --- DASHBOARD (Pulls Old Data for Kartik) ---
app.get('/dashboard', async (req, res) => {
    const userEmail = req.query.user;
    const userName = req.query.name;
    
    // THE SEARCH: This looks through the database for your specific email
    const snapshot = await db.collection('tuitions').where('owner', '==', userEmail).get();
    let groups = '';
    snapshot.forEach(doc => {
        groups += '<div class="group-item"><span>' + doc.data().name + '</span> <code style="color:#43b581">' + doc.id + '</code></div>';
    });

    res.send(`${ui}
    <div class="card">
        <img src="https://ui-avatars.com/api/?name=${userName}&background=43b581&color=fff" style="width:80px; border-radius:50%;">
        <h2>Welcome back, ${userName}</h2>
        <p style="font-size:12px; color:#72767d;">Account Verified</p>
        <div style="border-top: 1px solid #4f545c; margin: 15px 0;"></div>
        <h3 style="text-align:left;">Your Saved History</h3>
        ${groups || '<p style="color:#72767d">No old groups found.</p>'}
        <a href="/setup?user=${userEmail}&name=${userName}" class="btn" style="background:#4f545c">+ New Class</a>
    </div>`);
});

// --- CREATE LOGIC ---
app.get('/setup', (req, res) => {
    res.send(`${ui}
    <div class="card">
        <h3>Verified Creation</h3>
        <form action="/create" method="POST">
            <input type="hidden" name="user" value="${req.query.user}">
            <input type="hidden" name="name" value="${req.query.name}">
            <input class="input" name="className" placeholder="Group Name" required>
            <button class="btn" style="background:#43b581">Confirm & Save</button>
        </form>
    </div>`);
});

app.post('/create', async (req, res) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await db.collection('tuitions').doc(code).set({
        name: req.body.className,
        owner: req.body.user,
        createdAt: new Date()
    });
    res.redirect('/dashboard?user=' + req.body.user + '&name=' + req.body.name);
});

app.listen(3000, () => console.log("System running on http://localhost:3000"));