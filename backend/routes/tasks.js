const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET: Pobierz wszystkie aktywne zadania dla tablicy Kanban
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ isArchived: false }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err); // Dobre praktyki: logowanie błędu na serwerze
    res.status(500).json({ message: "Błąd serwera podczas pobierania zadań." });
  }
});

// GET: Pobierz wszystkie zadania z datą dla kalendarza
router.get('/calendar', async (req, res) => {
    try {
        const tasks = await Task.find({ dueDate: { $ne: null } });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera podczas pobierania zadań dla kalendarza." });
    }
});

// POST: Stwórz nowe zadanie
router.post('/', async (req, res) => {
  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ message: 'Tekst zadania jest wymagany.' });
  }
  const task = new Task({ text: req.body.text });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Nie udało się stworzyć zadania." });
  }
});

// PUT: Zaktualizuj zadanie
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updatedTask) return res.status(404).json({ message: "Nie znaleziono zadania." });
        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Nie udało się zaktualizować zadania." });
    }
});

// DELETE: Usuń zadanie
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: "Nie znaleziono zadania." });
        res.json({ message: 'Zadanie usunięte' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Nie udało się usunąć zadania." });
    }
});

// POST: Archiwizuje ukończone zadania
router.post('/archive-done', async (req, res) => {
    try {
        await Task.updateMany(
            { status: 'done', isArchived: false },
            { $set: { isArchived: true } }
        );
        res.status(200).json({ message: 'Ukończone zadania zostały zarchiwizowane.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd podczas archiwizacji." });
    }
});

module.exports = router;