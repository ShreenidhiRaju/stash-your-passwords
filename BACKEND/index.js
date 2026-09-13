require('dotenv').config()
const path = require("path");
const crypto = require("crypto");
const express = require('express');
const cookieParser = require("cookie-parser");
const cors=require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient ,ObjectId} = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);


// Database Name
const dbName = 'passop';
const app = express();
app.use(express.json())
app.use(cors({
    origin: "https://stash-your-passwords.vercel.app",
    credentials: true
}));
app.use(cookieParser());

const port = process.env.PORT || 3000;
client.connect();
const db = client.db(dbName);

const collection = db.collection("documents");
const usersCollection = db.collection("users");
usersCollection.createIndex(
    { email: 1 },
    { unique: true }
);
const encryptionKey = Buffer.from(
    process.env.ENCRYPTION_KEY,
    "base64"
);

const encryptPassword = (password) => {

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        encryptionKey,
        iv
    );

    let encrypted = cipher.update(
        password,
        "utf8",
        "base64"
    );

    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag();

    return {
        encrypted,
        iv: iv.toString("base64"),
        authTag: authTag.toString("base64")
    };
};
const decryptPassword = (encryptedData) => {

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        encryptionKey,
        Buffer.from(encryptedData.iv, "base64")
    );

    decipher.setAuthTag(
        Buffer.from(encryptedData.authTag, "base64")
    );

    let decrypted = decipher.update(
        encryptedData.encrypted,
        "base64",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
};
app.post("/api/auth/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const existingUser = await usersCollection.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find the user
        const user = await usersCollection.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with stored bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000
});

return res.status(200).json({
    message: "Login successful"
});

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});
const authenticateToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = user;
        next();
    });
};
app.post("/api/auth/logout", (req, res) => {

    res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
});

    res.status(200).json({
        message: "Logged out successfully"
    });
});
app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.status(200).json({
        user: req.user
    });
});

//get passwords
app.get('/api/passwords', authenticateToken, async (req, res) => {

    const findResult = await collection.find({
        userId: req.user.userId
    }).toArray();

    const passwords = findResult.map(item => ({
        ...item,
        password: decryptPassword(item.password)
    }));

    res.json(passwords);
});

//delete passwords
app.delete('/api/passwords', authenticateToken, async (req, res) => {

    const findResult = await collection.deleteOne({
        _id: new ObjectId(req.body.id),
        userId: req.user.userId
    });

    if (findResult.deletedCount === 0) {
        return res.status(404).json({
            message: "Credential not found"
        });
    }

    res.json({ success: true });
});

//insert passwords
app.post('/api/passwords', authenticateToken, async (req, res) => {

    const encryptedPassword = encryptPassword(req.body.password);

    const passwordWithUser = {
        site: req.body.site,
        username: req.body.username,
        password: encryptedPassword,
        userId: req.user.userId
    };

    await collection.insertOne(passwordWithUser);

    res.json({ success: true });
});

//update passwords
app.put('/api/passwords', authenticateToken, async (req, res) => {

    const encryptedPassword = encryptPassword(req.body.password);

    const findResult = await collection.updateOne(
        {
            _id: new ObjectId(req.body.id),
            userId: req.user.userId
        },
        {
            $set: {
                site: req.body.site,
                username: req.body.username,
                password: encryptedPassword
            }
        }
    );

    if (findResult.matchedCount === 0) {
        return res.status(404).json({
            message: "Credential not found"
        });
    }

    res.json({ success: true });
});

app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

app.get("/{*splat}", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../FRONTEND/dist/index.html")
    );
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});