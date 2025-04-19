const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/recommend', (req, res) => {
    const { user1, user2 } = req.body;

    if (!user1 || !user2) {
        return res.status(400).json({ error: "Missing user1 or user2 in request body" });
    }

    exec(`python model.py ${user1} ${user2}`, (err, stdout, stderr) => {
        if (err) {
            console.error(" Python execution error:", err.message);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (stderr) {
            console.error("⚠️ Python stderr:", stderr); // Just logs, doesn't crash
        }

        try {
            // Get the last line that contains JSON only
            const lines = stdout.trim().split("\n");
            const jsonLine = lines[lines.length - 1];

            const result = JSON.parse(jsonLine); // ✅ Now safe
            res.json(result);
        } catch (e) {
            console.error(" JSON parse error:", e.message);
            res.status(500).json({ error: "Invalid JSON returned by model.py" });
        }
    });
});

app.listen(port, () => {
    console.log(` Server running on http://localhost:${port}`);
});
