const express = require("express");
const app = express();
require("dotenv").config();
// var jwt = require("jsonwebtoken");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijwgr8d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("AppStoreDB").collection("users");
    const allAppCollection = client.db("AppStoreDB").collection("allApps");

    // jwt api
    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token });
    // });

    // user information
    // app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    //   const result = await userCollection.find().toArray();
    //   res.send(result);
    // });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // insert email
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // All Apps
    app.post("/allApps", async (req, res) => {
      const newAppItem = req.body;
      const result = await allAppCollection.insertOne(newAppItem);
      res.send(result);
    });

      // user related
      app.get("/allApps", async (req, res) => {
        const result = await allAppCollection.find().toArray();
        res.send(result);
      });

      app.delete("/allApps/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await allAppCollection.deleteOne(query);
        res.send(result);
      });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("App Store running");
});

app.listen(port, () => {
  console.log(`App Store running on post ${port}`);
});
