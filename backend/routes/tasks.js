const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Importujemy nasz model

// GET: Pobierz wszystkie zadania
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Stwórz nowe zadanie
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

// PUT: Zaktualizuj status zadania
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;