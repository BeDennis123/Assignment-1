var express = require("express");
var router = express.Router();

const { connectToDB, ObjectId } = require("../utils/db");
const { route } = require("../app");



/* GET event form */
router.get("/event/new", async function (req, res) {
  try {
    res.render("pages/event/new");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* Handle the Form */
router.post("/event/new", async function (req, res) {
  const db = await connectToDB();
  try {
    console.log(req.body);
    let result = await db.collection("events").insertOne(req.body);
    res
      .status(201)
      .render("pages/event/new", { message: "Record Created Success, copy this link to the home page: localhost:3000/" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* GET current event form */
router.get("/event/edit/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db
      .collection("events")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render("pages/event/edit", { event: result });
    } else {
      res.status(404).json({ message: "Event not found, copy this link to the home page: localhost:3000/" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Update a single event
router.post("/event/edit/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.eventTitle = req.body.eventTitle || "";
    req.body.organizer = req.body.organizer || "";
    req.body.datetime = req.body.datetime;
    req.body.location = req.body.location || "";
    req.body.description = req.body.description || "";
    req.body.quota = parseInt(req.body.quota);
    req.body.image = req.body.image || "";
    req.body.highlight = req.body.highlight || "";

    let result = await db
      .collection("events")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Event updated, copy this link to the home page: localhost:3000/" });
    } else {
      res.status(404).json({ message: "Event not found, copy this link to the home page: localhost:3000/" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


/* GET home page. */
//=search function
router.get("/", async function (req, res, next) {
  try {
    const db = await connectToDB();
    let result = await db.collection("events").find({}, {}).toArray();
    let slides = await db.collection("events").find({ terms: true }, {}).toArray();
    res.render("pages/event/index", { events: result, slides: slides});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Pagination based on query parameters page and limit, also returns total number of documents
router.get("/event", async function (req, res) {
  const db = await connectToDB();
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 6;
    let skip = (page - 1) * perPage;

    let result = await db
      .collection("events")
      .find()
      .skip(skip)
      .limit(perPage)
      .toArray();
    let total = await db.collection("events").countDocuments();
    console.log(result);

    res.render("pages/event/event", {
      events: result,
      total: total,
      page: page,
      perPage: perPage,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Handle the Form */
router.post("/event", async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms == "on";
    req.body.createdAt = new Date();
    req.body.modifiedAt = new Date();

    let result = await db.collection("events").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


/* Display a single event */
router.get("/event/detail/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db
      .collection("events")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render("pages/event/detail", { event: result });
    } else {
      res.status(404).json({ message: "event not found, copy this link to the home page: localhost:3000/" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Delete a single event
router.post("/event/delete/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db
      .collection("events")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "event deleted, copy this link to the home page: localhost:3000/" });
    } else {
      res.status(404).json({ message: "event not found, copy this link to the home page: localhost:3000/" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


// Search events
//change it for 
// router.get("/event/search", async function (req, res) {
//   const db = await connectToDB();
//   try {
//     let query = {};
//     if (req.query.email) {
//       // query.email = req.query.email;
//       query.email = { $regex: req.query.email };
//     }
//     if (req.query.numTickets) {
//       query.numTickets = parseInt(req.query.numTickets);
//     }

//     let result = await db.collection("events").find(query).toArray();
//     res.render("pages/event/event", { events: result });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   } finally {
//     await db.client.close();
//   }
// });

/* GET volunteer form */
router.get("/event/become", async function (req, res) {
  try {
    res.render("pages/event/become");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* Handle the Form */
router.post("/event/become", async function (req, res) {
  const db = await connectToDB();
  try {
    console.log(req.body);
    let result = await db.collection("volunteers").insertOne(req.body);
    res
      .status(201)
      .render("pages/event/become", { message: "Record Created Success, copy this link to the home page: localhost:3000/" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


module.exports = router;
