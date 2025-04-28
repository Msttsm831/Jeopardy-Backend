const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Jeoprady = require("../models/jeoprady.js");
const router = express.Router();


router.post("/", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id; 
      const jeoprady = await Jeoprady.create(req.body); 
      jeoprady._doc.author = req.user; 
      res.status(201).json(jeoprady); 
    } catch (err) {
      res.status(500).json({ err: err.message }); 
    }
  });

  router.get("/", verifyToken, async (req, res) => {
    try {
      const games = await Jeoprady.find({})
        .populate("author")
        .sort({ createdAt: "desc" });
      res.status(200).json(games);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

  router.get("/:jeopradyId", verifyToken, async (req, res) => {
    try {
      const jeoprady = await Jeoprady.findById(req.params.jeopradyId).populate("author");
      res.status(200).json(jeoprady);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });


module.exports = router;