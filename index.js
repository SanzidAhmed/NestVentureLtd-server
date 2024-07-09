const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3300;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c70onov.mongodb.net/?appName=Cluster0`;

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
    const sliderCollection = client.db("NestVentureDB").collection("slider");
    const aboutCompanyCollection = client
      .db("NestVentureDB")
      .collection("about-company");
    const growthCollection = client.db("NestVentureDB").collection("growth");
    const statisticsCollection = client
      .db("NestVentureDB")
      .collection("statistics");
    const servicesCollection = client
      .db("NestVentureDB")
      .collection("services");
    const videoCollection = client
      .db("NestVentureDB")
      .collection("company-video");
    const howDoesNestWorksCollection = client
      .db("NestVentureDB")
      .collection("how-does-nest-work");
    const formCollection = client
      .db("NestVentureDB")
      .collection("google-forms");
    const testimonialsCollection = client
      .db("NestVentureDB")
      .collection("testimonials");

    app.get("/slider", async (req, res) => {
      const result = await sliderCollection.find().toArray();
      res.json(result);
    });
    app.get("/slider/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sliderCollection.findOne(query);
      res.send(result);
    });
    app.put("/slider/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSlider = req.body;
      const slider = {
        $set: {
          title: updatedSlider.title,
          image: updatedSlider.image,
          description: updatedSlider.description,
        },
      };
      const result = await sliderCollection.updateOne(filter, slider, options);
      res.send(result);
    });
    app.get("/about-company", async (req, res) => {
      const result = await aboutCompanyCollection.find().toArray();
      res.json(result);
    });
    app.get("/about-company/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await aboutCompanyCollection.findOne(query);
      res.send(result);
    });
    app.get("/growth", async (req, res) => {
      const result = await growthCollection.find().toArray();
      res.json(result);
    });
    app.get("/statistics", async (req, res) => {
      const result = await statisticsCollection.find().toArray();
      res.json(result);
    });
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });
    app.get("/video", async (req, res) => {
      const result = await videoCollection.find().toArray();
      res.json(result);
    });
    app.get("/how-does-nest-works", async (req, res) => {
      const result = await howDoesNestWorksCollection.find().toArray();
      res.json(result);
    });
    app.get("/google-form", async (req, res) => {
      const result = await formCollection.find().toArray();
      res.json(result);
    });
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.json(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send("boss is sitting");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
