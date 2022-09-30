const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zgbvl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const foodCollection = client.db('foodApp').collection('userFood');

        app.get('/item', async (req, res) => {
            const query = req.query;
            const cursor = foodCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.post('/item', async (req, res) => {
            const query = req.body;
            const result = await foodCollection.insertOne(query);
            res.send(result);
        });


        app.delete("/item/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(filter);
            res.send(result);
        });
    }
    catch {

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('food app');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
