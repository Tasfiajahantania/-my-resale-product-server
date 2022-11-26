const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://taniadb:oWKaLmYtQqtEhZYa@cluster0.hyahdcy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const productCollection = client.db("alexashop").collection('products');
        const categoryCollection = client.db("alexashop").collection('categories');

        app.get('/all/products', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/all/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })


    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send(`${process.env.APP_NAME} server is running.....`);
})

app.listen(port, () => {
    console.log(`${process.env.APP_NAME} running on: ${port}`)
})