var express = require("express");
var router = express.Router();

const { connectToDB, ObjectId } = require("../utils/db");

/* Display all Bookings */
router.get("/event", async function (req, res) {
  const db = await connectToDB();
  try {
    let results = await db.collection("bookings").find().toArray();
    res.render("event", { bookings: results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Expresso" });
});

/* Handle the Form */
router.post("/bookings", async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms == "on";
    req.body.createdAt = new Date();
    req.body.modifiedAt = new Date();

    let result = await db.collection("bookings").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Display all Bookings */
router.get("/bookings", async function (req, res) {
  const db = await connectToDB();
  try {
    let results = await db.collection("bookings").find().toArray();
    res.render("bookings", { bookings: results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Display a single Booking */
router.get("/bookings/read/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render("booking", { booking: result });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Delete a single Booking
router.post("/bookings/delete/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db
      .collection("bookings")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Booking deleted" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// display the update form
router.get("/bookings/update/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render("update", { booking: result });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Update a single Booking
router.post("/bookings/update/:id", async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms == "on";
    req.body.superhero = req.body.superhero || "";
    req.body.modifiedAt = new Date();

    let result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Booking updated" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Search Bookings
router.get("/bookings/search", async function (req, res) {
  const db = await connectToDB();
  try {
    let query = {};
    if (req.query.email) {
      // query.email = req.query.email;
      query.email = { $regex: req.query.email };
    }
    if (req.query.numTickets) {
      query.numTickets = parseInt(req.query.numTickets);
    }

    let result = await db.collection("bookings").find(query).toArray();
    res.render("bookings", { bookings: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Pagination based on query parameters page and limit, also returns total number of documents
router.get("/bookings/paginate", async function (req, res) {
  const db = await connectToDB();
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let skip = (page - 1) * perPage;

    let result = await db
      .collection("bookings")
      .find()
      .skip(skip)
      .limit(perPage)
      .toArray();
    let total = await db.collection("bookings").countDocuments();

    res.render("paginate", {
      bookings: result,
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

module.exports = router;
