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
      const jeoprady = await Jeoprady.findById(req.params.jeopradyId).populate("author")
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



// Add Questions to Jeoprady Game
router.post("/:jeopradyId/questions", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const jeoprady = await Jeoprady.findById(req.params.jeopradyId);

    if (!jeoprady) {
      return res.status(404).json({ error: "Jeoprady not found!" });
    }

    jeoprady.questions.push(req.body);
    await jeoprady.save();

    const newQuestion = jeoprady.questions[jeoprady.questions.length - 1];
    newQuestion._doc.author = req.user;

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


// show route for the question
router.get('/:jeopradyId/questions/:questionId', verifyToken, async (req, res) => {
  try {
    const jeoprady = await Jeoprady.findById(req.params.jeopradyId);
    if (!jeoprady) {
      return res.status(404).json({ error: 'jeoprady game not found' });
    }
    const question = jeoprady.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Edit questions added
router.put("/:jeopradyId/questions/:questionId", verifyToken, async (req, res) => {
  try {
    const jeoprady = await Jeoprady.findById(req.params.jeopradyId);
    if (!jeoprady) {
      return res.status(404).json({ message: "Jeoprady game not found" });
    }

    if (jeoprady.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to update this question" });
    }

    const question = jeoprady.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (req.body.questionText) question.questionText = req.body.questionText;
    if (req.body.options) question.options = req.body.options;
    if (req.body.correctAnswer) question.correctAnswer = req.body.correctAnswer;
    if (req.body.points) question.points = req.body.points;
    if (req.body.category) question.category = req.body.category;

    await jeoprady.save();
    res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.delete("/:jeopradyId/questions/:questionId", verifyToken, async (req, res) => {
  try {
    // Find the Jeoprady document by ID
    const jeoprady = await Jeoprady.findById(req.params.jeopradyId);
    if (!jeoprady) {
      return res.status(404).json({ message: "Jeoprady game not found" });
    }

    // Check if the authenticated user is the author of the Jeoprady game
    if (jeoprady.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to delete this question" });
    }

    await Jeoprady.updateOne(
      { _id: req.params.jeopradyId },
      { $pull: { questions: { _id: req.params.questionId } } }
    );

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;