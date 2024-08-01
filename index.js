const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const port = process.env.PORT || 3300;

// middleware
app.use(cors());
app.use(express.json());
app.use("/storage", express.static(path.join(__dirname, "storage")));

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
const imageUpload = path.join(__dirname, "storage");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUpload);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
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

    app.get("/slider", async (req, res) => {
      const result = await sliderCollection.find().toArray();
      res.json(result);
    });
    app.post("/slider", upload.single("image"), async (req, res) => {
      const newSlider = {
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        image: `/storage/${req.file.filename}`,
      };

      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      try {
        // Path to the uploaded file
        const filePath = req.file.path;

        // Resize image
        const resizedImage = await sharp(filePath)
          .resize({ width: 800, height: 600, fit: "inside" })
          .jpeg({ quality: 80 })
          .toBuffer();

        if (resizedImage.length > 1024 * 1024) {
          return res
            .status(400)
            .send("Image size exceeds 1MB even after resizing.");
        }

        // Save to MongoDB
        const result = await sliderCollection.insertOne(newSlider);

        res.send(result);
      } catch (error) {
        res.status(500).send("Error processing file.");
      }
    });
    app.get("/slider/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sliderCollection.findOne(query);
      res.send(result);
    });
    app.put("/slider/:id", upload.single("image"), async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedSlider = req.body;
      const options = { upsert: true };

      try {
        const existingSlider = await sliderCollection.findOne(filter);

        if (!existingSlider) {
          return res.status(404).send({ message: "Slider not found" });
        }

        const updateDoc = {
          $set: {
            title: updatedSlider.title,
            description: updatedSlider.description,
            link: updatedSlider.link,
            image: req.file
              ? `/storage/${req.file.filename}`
              : existingSlider.image,
          },
        };

        const result = await sliderCollection.updateOne(
          filter,
          updateDoc,
          options
        );

        if (req.file) {
          const oldImagePath = path.join(
            __dirname,
            "storage",
            existingSlider.image.split("/storage/")[1]
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
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
    app.put("/about-company/:id", upload.single("image"), async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedAbout = req.body;
      console.log(updatedAbout);
      const options = { upsert: true };

      try {
        const existingAbout = await aboutCompanyCollection.findOne(filter);

        if (!existingAbout) {
          return res.status(404).send({ message: "About not found" });
        }

        const updateDoc = {
          $set: {
            title: updatedAbout.title,
            description: updatedAbout.description,
            section1Title: updatedAbout.section1Title,
            section1Description: updatedAbout.section1Description,
            section2Title: updatedAbout.section2Title,
            section2Description: updatedAbout.section2Description,
            headline: updatedAbout.headline,
            image: req.file
              ? `/storage/${req.file.filename}`
              : existingAbout.image,
          },
        };

        const result = await aboutCompanyCollection.updateOne(
          filter,
          updateDoc,
          options
        );

        if (req.file) {
          const oldImagePath = path.join(
            __dirname,
            "storage",
            existingAbout.image.split("/storage/")[1]
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
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
          image: updatedGrowth.image || existingGrowth.mainImage,
          mainImage: existingGrowth.image,
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
          image: updatedService.image || existingService.mainImage,
          mainImage: existingService.image,
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
      const video = {
        $set: {
          title: updatedVideo.title,
          thumbnail: updatedVideo.thumbnail,
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
          image: updatedBody.image || existingWork.mainImage,
          mainImage: existingWork.image,
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
    app.get("/google-form", async (req, res) => {
      const result = await formCollection.find().toArray();
      res.json(result);
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
          image: updateSponsor.image || existingSponsor.mainImage,
          mainImage: existingSponsor.image,
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
