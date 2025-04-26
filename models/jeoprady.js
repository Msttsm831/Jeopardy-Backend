const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },
        message: 'A question must have at least two options.'
      }
    },
    correctAnswer: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    category: {
      type: String, // to select the category
      required: true
    }
  },
  { timestamps: true }
);

// Schema for the Jeopardy game
const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: [questionSchema] 
  },
  { timestamps: true }
);


const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
