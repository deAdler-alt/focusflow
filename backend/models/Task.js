const mongoose = require('mongoose');

// Definiujemy schemat dla pojedynczego elementu na checkliście
const checklistItemSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

// Definiujemy główny schemat dla zadania
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
    default: 'todo' // Domyślny status to "Do zrobienia"
  },
  isArchived: {
    type: Boolean,
    default: false // Domyślnie zadanie nie jest zarchiwizowane
  },
  dueDate: {
    type: Date,
    default: null // Data ukończenia, domyślnie pusta
  },
  checklist: [checklistItemSchema], // Tablica z elementami checklisty
  createdAt: {
    type: Date,
    default: Date.now // Automatyczna data utworzenia
  }
});

// ... (istniejące endpointy GET, POST, PUT, POST /archive-done) ...

// NOWY ENDPOINT: Pobiera wszystkie zadania (również zarchiwizowane), które mają ustawioną datę
router.get('/calendar', async (req, res) => {
    try {
        const tasks = await Task.find({ dueDate: { $ne: null } }); // Znajdź zadania, gdzie `dueDate` nie jest puste
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

module.exports = mongoose.model('Task', taskSchema);