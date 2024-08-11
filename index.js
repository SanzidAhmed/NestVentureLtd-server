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
    const stepsCollection = client.db("NestVentureDB").collection("steps");
    const registrationformAsInvestorCollection = client
      .db("NestVentureDB")
      .collection("investor-registration-form");
    const sponsorsCollection = client
      .db("NestVentureDB")
      .collection("sponsors");
    const logoCollection = client.db("NestVentureDB").collection("logo");

    app.get("/logo", async (req, res) => {
      const result = await logoCollection.find().toArray();
      res.json(result);
    });
    app.get("/logo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await logoCollection.findOne(query);
      res.send(result);
    });
    app.put("/logo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateLogo = req.body;

      // Fetch the existing slider data
      const existingLogo = await logoCollection.findOne(filter);

      const logo = {
        $set: {
          image: updateLogo.image || existingLogo.mainImage, // Retain the existing image if not provided
          mainImage: existingLogo.image,
        },
      };

      const result = await logoCollection.updateOne(filter, logo, options);
      res.send(result);
    });
    app.get("/slider", async (req, res) => {
      const result = await sliderCollection.find().toArray();
      res.json(result);
    });
    app.post("/slider", async (req, res) => {
      const newSlider = req.body;
      const result = await sliderCollection.insertOne(newSlider);
      res.send(result);
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

      // Fetch the existing slider data
      const existingSlider = await sliderCollection.findOne(filter);

      const slider = {
        $set: {
          title: updatedSlider.title,
          image: updatedSlider.image || existingSlider.image, // Retain the existing image if not provided
          description: updatedSlider.description,
          link: updatedSlider.link,
        },
      };

      const result = await sliderCollection.updateOne(filter, slider, options);
      res.send(result);
    });

    app.delete("/slider/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sliderCollection.deleteOne(query);
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
    app.put("/about-company/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAbout = req.body;
      const existingAbout = await aboutCompanyCollection.findOne(filter);

      const about = {
        $set: {
          title: updatedAbout.title,
          image: updatedAbout.image || existingAbout.image,
          description: updatedAbout.description,
          headline: updatedAbout.headline,
          section1Title: updatedAbout.section1Title,
          section1Description: updatedAbout.section1Description,
          section2Title: updatedAbout.section2Title,
          section2Description: updatedAbout.section2Description,
        },
      };
      const result = await aboutCompanyCollection.updateOne(
        filter,
        about,
        options
      );
      res.send(result);
    });
    app.get("/growth", async (req, res) => {
      const limit = parseInt(req.query.limit) || 4;
      const result = await growthCollection.find().limit(limit).toArray();
      res.json(result);
    });
    app.post("/growth", async (req, res) => {
      const newGrowth = req.body;
      const result = await growthCollection.insertOne(newGrowth);
      res.send(result);
    });
    app.get("/growth/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await growthCollection.findOne(query);
      res.send(result);
    });
    app.delete("/growth/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await growthCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/growth/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedGrowth = req.body;
      const existingGrowth = await growthCollection.findOne(filter);
      const service = {
        $set: {
          title: updatedGrowth.title,
          image: updatedGrowth.image || existingGrowth.image,
          buttonText: updatedGrowth.buttonText,
        },
      };
      const result = await growthCollection.updateOne(filter, service, options);
      res.send(result);
    });
    app.get("/statistics", async (req, res) => {
      const result = await statisticsCollection.find().toArray();
      res.json(result);
    });
    app.get("/statistics/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await statisticsCollection.findOne(query);
      res.send(result);
    });
    app.put("/statistics/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedStatistic = req.body;
      const about = {
        $set: {
          value: updatedStatistic.value,
          label: updatedStatistic.label,
        },
      };
      const result = await statisticsCollection.updateOne(
        filter,
        about,
        options
      );
      res.send(result);
    });
    app.get("/services", async (req, res) => {
      const limit = parseInt(req.query.limit) || 6;
      const result = await servicesCollection.find().limit(limit).toArray();
      res.send(result);
    });
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.send(result);
    });
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedService = req.body;
      const existingService = await servicesCollection.findOne(filter);

      const service = {
        $set: {
          title: updatedService.title,
          image: updatedService.image || existingService.image,
          description: updatedService.description,
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        service,
        options
      );
      res.send(result);
    });
    app.get("/video", async (req, res) => {
      const result = await videoCollection.find().toArray();
      res.json(result);
    });
    app.get("/video/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await videoCollection.findOne(query);
      res.send(result);
    });
    app.put("/video/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedVideo = req.body;
      const existingVideo = await videoCollection.findOne(filter);
      const video = {
        $set: {
          title: updatedVideo.title,
          thumbnail: updatedVideo.thumbnail || existingVideo.thumbnail,
          description: updatedVideo.description,
          videoUrl: updatedVideo.videoUrl,
        },
      };
      const result = await videoCollection.updateOne(filter, video, options);
      res.send(result);
    });
    app.get("/how-does-nest-works", async (req, res) => {
      const result = await howDoesNestWorksCollection.find().toArray();
      res.json(result);
    });
    app.get("/how-does-nest-works/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await howDoesNestWorksCollection.findOne(query);
      res.send(result);
    });
    app.put("/how-does-nest-works/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBody = req.body;
      const existingWork = await howDoesNestWorksCollection.findOne(filter);

      const bodyData = {
        $set: {
          title: updatedBody.title,
          description: updatedBody.description,
          image: updatedBody.image || existingWork.image,
        },
      };
      const result = await howDoesNestWorksCollection.updateOne(
        filter,
        bodyData,
        options
      );
      res.send(result);
    });
    app.get("/steps", async (req, res) => {
      const limit = parseInt(req.query.limit) || 8;
      const result = await stepsCollection.find().limit(limit).toArray();
      res.json(result);
    });
    app.get("/steps-dashboard", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const stepsCursor = stepsCollection.find().skip(skip).limit(limit);
      const steps = await stepsCursor.toArray(); // Convert the cursor to an array
      const total = await stepsCollection.countDocuments();
      res.send({ steps, total });
    });
    app.get("/steps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await stepsCollection.findOne(query);
      res.send(result);
    });
    app.delete("/steps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await stepsCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/steps/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedStep = req.body;
      const step = {
        $set: {
          title: updatedStep.title,
          description: updatedStep.description,
        },
      };
      const result = await stepsCollection.updateOne(filter, step, options);
      res.send(result);
    });
    app.get("/register-as-investor", async (req, res) => {
      const result = await registrationformAsInvestorCollection
        .find()
        .toArray();
      res.send(result);
    });
    app.post("/register-as-investor", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);

      const result = await registrationformAsInvestorCollection.insertOne(
        newUser
      );
      res.send(result);
    });
    app.get("/register-as-investor/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await registrationformAsInvestorCollection.findOne(query);
      res.send(result);
    });
    app.delete("/register-as-investor/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await registrationformAsInvestorCollection.deleteOne(
        query
      );
      res.send(result);
    });
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.json(result);
    });
    app.get("/testimonials/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await testimonialsCollection.findOne(query);
      res.send(result);
    });
    app.put("/testimonials/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTestimonial = req.body;
      const testimonials = {
        $set: {
          name: updatedTestimonial.name,
          testimonial: updatedTestimonial.testimonial,
        },
      };
      const result = await testimonialsCollection.updateOne(
        filter,
        testimonials,
        options
      );
      res.send(result);
    });
    app.delete("/testimonials/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await testimonialsCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/sponsors", async (req, res) => {
      const result = await sponsorsCollection.find().toArray();
      res.json(result);
    });
    app.get("/sponsors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sponsorsCollection.findOne(query);
      res.send(result);
    });
    app.put("/sponsors/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSponsor = req.body;
      const existingSponsor = await sponsorsCollection.findOne(filter);
      const sponsor = {
        $set: {
          image: updateSponsor.image || existingSponsor.image,
        },
      };
      const result = await sponsorsCollection.updateOne(
        filter,
        sponsor,
        options
      );
      res.send(result);
    });
    app.delete("/sponsors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sponsorsCollection.deleteOne(query);
      res.send(result);
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
