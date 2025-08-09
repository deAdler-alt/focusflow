const mongoose = require('mongoose');

// Definiujemy schemat dla pojedynczego elementu na checkliście
const checklistItemSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

// Definiujemy główny schemat dla zadania, uwzględniając wszystkie nasze planowane pola
const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    default: 'todo'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  checklist: [checklistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);