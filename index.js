const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.port || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s4r5a93.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const orderCollection = client
      .db("pizza-delivery-app")
      .collection("orders");
    const deliveries = client.db("pizza-delivery-app").collection("deliveries");

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.post("/deliveries", async (req, res) => {
      const deliveryAddress = req.body;
      const result = await deliveries.insertOne(deliveryAddress);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world Again!");
});

app.get("/login", (req, res) => {
  res.send("Hello user, login!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
