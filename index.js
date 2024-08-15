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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.post("/topics", async (req, res) => {
            const item = req.body;
            const result = await topicsCollection.insertOne(item);
            res.send(result);
        });

        app.get("/topics", async (req, res) => {
            const result = await topicsCollection.find().toArray();
            res.send(result);
        });

        app.delete("/topics/:id", async (req, res) => {
            const id = req.params.id;
        
            // Validate the id before using it
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ error: "Invalid ID format" });
            }
        
            try {
                const query = { _id: new ObjectId(id) };
                const result = await topicsCollection.deleteOne(query);
        
                if (result.deletedCount === 0) {
                    return res.status(404).send({ error: "Topic not found" });
                }
        
                res.send({ message: "Topic deleted successfully" });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "An error occurred while deleting the topic" });
            }
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
