const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
require("dotenv").config();
app.use(cors());
app.use(express.json());

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h9wahhk.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    //  names
    const featuredCollection = client
      .db("cafeRoyale")
      .collection("featuredProduct");
    // all coffee
    const all_coffee_collection = client
      .db("cafeRoyale")
      .collection("all-coffee-categories");
    // my order
    const orderdCollection = client.db("cafeRoyale").collection("orderd_list");
    // user info
    const userCollection = client.db("cafeRoyale").collection("user_info");
    // all chef
    const chefCollection = client
      .db("cafeRoyale")
      .collection("chef_Introduction");

    // api start here
    app.get("/featured", async (req, res) => {
      const products = {};
      const query = await featuredCollection.find(products).toArray();
      res.send(query);
    });
    app.get("/all-categories", async (req, res) => {
      const categories = req.query.category;
      const query = { category: categories };
      const result = await all_coffee_collection.find(query).toArray();
      res.send(result);
    });
    app.get("/item-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await all_coffee_collection.findOne(query);
      res.send(result);
    });
    app.post("/orderd", async (req, res) => {
      const order = req.body;
      const result = await orderdCollection.insertOne(order);
      res.send(result);
    });
    app.get("/orderd", async (req, res) => {
      const email = req.query.email;
      const myallOrder = { Customer_email: email };
      const result = await orderdCollection.find(myallOrder).toArray();
      res.send(result);
      console.log(result);
    });
    // delete a item
    app.delete("/delete-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderdCollection.deleteOne(query);
      res.send(result);
    });
    // user info
    app.post("/userinfo", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/myinfo", async (req, res) => {
      const email = req.query.email;
      const query = { user_Email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
      console.log(result);
    });
    app.get("/myinfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
      console.log(result);
    });

    app.put("/myinfo/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const user = req.body;
      console.log(user);
      const option = { upsert: true };
      const updateFeild = {
        $set: {
          user_name: user.name,
          user_Email: user.email,
          College: user.college,
          Phone: user.phone,
          Gender: user.gender,
        },
      };
      const result = await userCollection.updateOne(query, updateFeild, option);

      res.send(result);
    });
    app.get("/chef", async (req, res) => {
      const query = {};
      const result = await chefCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/chef-information/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chefCollection.findOne(query);
      res.send(result);
    });
    app.get("/alluser", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.error());

app.get("/", (req, res) => {
  res.send("cafe server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// cafeRoyale
// X7ymLZ9kBh6XsUst
