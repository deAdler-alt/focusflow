const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
// backend/models/Task.js

const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

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
  isArchived: { // <-- NOWE POLE
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

// ZMIANA TUTAJ: Teraz pobieramy tylko zadania, które NIE SĄ zarchiwizowane
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ isArchived: false }); // <-- Dodajemy filtr
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint POST pozostaje bez zmian
router.post('/', async (req, res) => {
  const task = new Task({
    text: req.body.text,
    status: req.body.status || 'todo'
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint PUT pozostaje bez zmian
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// NOWY ENDPOINT: Archiwizuje wszystkie zadania, które są w kolumnie "Zrobione"
router.post('/archive-done', async (req, res) => {
    try {
        await Task.updateMany(
            { status: 'done', isArchived: false },
            { $set: { isArchived: true } }
        );
        res.status(200).json({ message: 'Ukończone zadania zostały zarchiwizowane.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;