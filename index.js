const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.patch("/deliveries/:orderId", async (req, res) => {
      const deliveryAddress = req.body;
      const orderId = req.params.orderId;
      const filter = { _id: new ObjectId(orderId) };
      const place = deliveryAddress.placeToDeliver;
      const newOrder = {
        $set: {
          place,
        },
      };
      const result = await orderCollection.updateOne(filter, newOrder);
      res.send(result);
    });

    app.get("/review-orders", async (req, res) => {
      const cursor = orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.patch("/review-orders/:orderId", async (req, res) => {
      const newStatus = req.body;
      const orderId = req.params.orderId;
      const filter = { _id: new ObjectId(orderId) };
      const status = newStatus.status;
      const newOrder = {
        $set: {
          status,
        },
      };
      const result = await orderCollection.updateOne(filter, newOrder);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
