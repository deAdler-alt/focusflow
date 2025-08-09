import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns'; // Importujemy funkcję do formatowania dat
import './TaskModal.css';

interface ChecklistItem {
  _id?: string; // MongoDB doda _id
  text: string;
  completed: boolean;
}

interface Task {
  _id: string; 
  text: string;
  status: 'todo' | 'inprogress' | 'done';
  description?: string;
  dueDate?: string; // Data będzie stringiem w formacie ISO
  checklist?: ChecklistItem[];
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => Promise<void>;
}

const TaskModal = ({ task, onClose, onSave }: TaskModalProps) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleSave = async () => {
    await onSave(editedTask);
    toast.success("Zmiany zapisane!");
    onClose();
  };
  
  // --- LOGIKA CHECKLISTY ---
  const handleChecklistItemChange = (index: number, newText: string) => {
    const newChecklist = [...(editedTask.checklist || [])];
    newChecklist[index].text = newText;
    setEditedTask({ ...editedTask, checklist: newChecklist });
  };

  const handleToggleChecklistItem = (index: number) => {
    const newChecklist = [...(editedTask.checklist || [])];
    newChecklist[index].completed = !newChecklist[index].completed;
    setEditedTask({ ...editedTask, checklist: newChecklist });
  };
  
  const handleAddChecklistItem = () => {
    const newChecklist = [...(editedTask.checklist || []), { text: '', completed: false }];
    setEditedTask({ ...editedTask, checklist: newChecklist });
  };

  const handleRemoveChecklistItem = (index: number) => {
    const newChecklist = [...(editedTask.checklist || [])];
    newChecklist.splice(index, 1);
    setEditedTask({ ...editedTask, checklist: newChecklist });
  }

  // Formatowanie daty dla pola input type="date"
  const formattedDueDate = editedTask.dueDate ? format(new Date(editedTask.dueDate), 'yyyy-MM-dd') : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <input 
          type="text" 
          className="modal-title-input" 
          value={editedTask.text}
          onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
        />
        
        <textarea
          className="modal-description"
          placeholder="Dodaj opis..."
          value={editedTask.description || ''}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
        />

        {/* --- NOWA SEKCJA: TERMIN WYKONANIA --- */}
        <div className="modal-section">
          <h3>Termin</h3>
          <input 
            type="date"
            className="modal-date-input"
            value={formattedDueDate}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
          />
        </div>

        {/* --- NOWA SEKCJA: CHECKLISTA --- */}
        <div className="modal-section">
          <h3>Checklista</h3>
          <div className="checklist">
            {(editedTask.checklist || []).map((item, index) => (
              <div key={index} className="checklist-item">
                <input 
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleChecklistItem(index)}
                />
                <input 
                  type="text"
                  className="checklist-item-text"
                  value={item.text}
                  onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                />
                <button onClick={() => handleRemoveChecklistItem(index)} className="remove-item-button">×</button>
              </div>
            ))}
          </div>
          <button onClick={handleAddChecklistItem} className="add-item-button">+ Dodaj element</button>
        </div>
        
        <div className="modal-actions">
          <button onClick={handleSave} className="save-button">Zapisz</button>
          <button onClick={onClose} className="cancel-button">Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;