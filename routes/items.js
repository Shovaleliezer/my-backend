const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// GET all items
// GET all items sorted by date (newest first)
// GET all items with search filter (by name or date)
router.get("/", async (req, res) => {
    const searchQuery = req.query.q; // Get the search query from the request query parameters
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Regular expression to match date format (e.g., 12/07/2023)
  
    try {
      let items;
  
      if (searchQuery) {
        // If there is a search query, check if it matches the date format
        const isDateQuery = dateRegex.test(searchQuery);
        
        if (isDateQuery) {
          // If it's a date query, find items with the given dateOfUpload
          items = await Item.find({ dateOfUpload: new Date(searchQuery) }).sort({ dateOfUpload: -1 });
        } else {
          // If it's not a date query, find items with the given title (case-insensitive)
          items = await Item.find({ title: { $regex: searchQuery, $options: "i" } }).sort({ dateOfUpload: -1 });
        }
      } else {
        // If there's no search query, return all items sorted by date (newest first)
        items = await Item.find().sort({ dateOfUpload: -1 });
      }
  
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  

// GET specific item by ID
router.get("/:id", getItem, (req, res) => {
  res.json(res.item);
});

// POST create new item
router.post("/", async (req, res) => {
  const item = new Item({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    amazonLink: req.body.amazonLink,
    aliexpressLink: req.body.aliexpressLink,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// DELETE all items
router.delete("/", async (req, res) => {
    try {
      await Item.deleteMany({});
      res.json({ message: "All items deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// DELETE specific item by ID
router.delete("/:id", getItem, async (req, res) => {
  try {
    await res.item.remove();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT edit specific item by ID
router.put("/:id", getItem, async (req, res) => {
  if (req.body.title != null) {
    res.item.title = req.body.title;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.image != null) {
    res.item.image = req.body.image;
  }
  if (req.body.amazonLink != null) {
    res.item.amazonLink = req.body.amazonLink;
  }
  if (req.body.aliexpressLink != null) {
    res.item.aliexpressLink = req.body.aliexpressLink;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get specific item by ID
async function getItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.item = item;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
