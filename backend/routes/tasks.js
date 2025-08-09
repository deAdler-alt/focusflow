// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET: Pobierz wszystkie aktywne zadania
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ isArchived: false }).sort({ createdAt: -1 }); // Sortujemy od najnowszych
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Endpoint dla kalendarza (bez zmian)
router.get('/calendar', async (req, res) => {
    try {
        const tasks = await Task.find({ dueDate: { $ne: null } });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Stwórz nowe zadanie
router.post('/', async (req, res) => {
  const task = new Task({ text: req.body.text });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Zaktualizuj zadanie
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// NOWY ENDPOINT: Usuń zadanie
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Zadanie usunięte' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Archiwizuje ukończone zadania
router.post('/archive-done', async (req, res) => {
    try {
        await Task.updateMany({ status: 'done', isArchived: false }, { $set: { isArchived: true } });
        res.status(200).json({ message: 'Ukończone zadania zostały zarchiwizowane.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;