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


// Edit Jeoprady
  router.put("/:jeopradyId", verifyToken, async (req, res) => {
    try {
      const jeoprady = await Jeoprady.findById(req.params.jeopradyId);
  
      if (!jeoprady.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to edit this game!");
      }
  
      const updatedJeoprady = await Jeoprady.findByIdAndUpdate(
        req.params.jeopradyId,
        req.body,
        { new: true }
      );
  
      updatedJeoprady._doc.author = req.user;
  
      res.status(200).json(updatedJeoprady);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });



  //Delete Jeoprady Game
  router.delete("/:jeopradyId", verifyToken, async (req, res) => {
    try {
      const jeoprady = await Jeoprady.findById(req.params.jeopradyId);
  
      if (!jeoprady.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }

      const deletedJeoprady = await Jeoprady.findByIdAndDelete(req.params.jeopradyId);

      res.status(200).json(deletedJeoprady);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

module.exports = router;