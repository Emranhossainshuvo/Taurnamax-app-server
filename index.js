const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("The server is running");
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bookify.na9grj3.mongodb.net/?retryWrites=true&w=majority&appName=bookify`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const topicsCollection = client.db('taurnamaxDB').collection('topics');
        
        // POST route inside run function where topicsCollection is accessible
        app.post("/topics", async (req, res) => {
            const item = req.body;
            const result = await topicsCollection.insertOne(item);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`The server is running on port: ${port}`);
});
