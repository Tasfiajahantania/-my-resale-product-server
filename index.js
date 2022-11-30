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
        const orderCollection = client.db("alexashop").collection('orders');
        const userCollection = client.db("alexashop").collection('users');

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

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const category = await categoryCollection.findOne(query);
            res.send(category);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        app.get('/latest/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query).sort({ _id: -1 }).limit(4);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(filter);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(filter)
            res.send(result)
        })
        app.get('/category/product/:id', async (req, res) => {
            const category = req.params.id;
            const query = { category: category };
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })

        app.post('/store/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        app.get('/my/orders/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email };
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);
        })

        app.post('/store/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        app.post('/store/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);

        })


        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/user/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })

        app.get('/all/users/:role', async (req, res) => {
            const role = req.params.role;
            const query = { role: role };
            const users = await userCollection.find(query).toArray();
            res.send(users);

        })

        app.get('/user/normal/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isUser: user?.role === 'user' });
        })

        app.get('/seller/products/:email', async (req, res) => {
            const email = req.params.email;
            const query = { seller_email: email };
            const products = await productCollection.find(query).toArray();
            res.send(products);

        })


    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send(`${process.env.APP_NAME} server is running`);
})

app.listen(port, () => {
    console.log(`${process.env.APP_NAME} running on: ${port}`)
})