const mongoose = require('mongoose');

// Definiujemy "schemat", czyli strukturę naszego zadania
const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true // To pole jest wymagane
  },
  status: {
    type: String,
    required: true,
    default: 'todo' // Domyślna wartość to 'todo'
  },
  // Możemy dodać też datę stworzenia, przyda się później
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Eksportujemy model, aby móc go używać w innych częściach aplikacji
module.exports = mongoose.model('Task', taskSchema);