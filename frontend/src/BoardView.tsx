import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { FaRegCalendarAlt, FaCheckSquare } from 'react-icons/fa';
import FocusMode from './FocusMode';
import TaskModal from './TaskModal';

// Interfejsy i stałe
interface ChecklistItem { _id?: string; text: string; completed: boolean; }
interface Task { _id: string; text: string; status: 'todo' | 'inprogress' | 'done'; description?: string; dueDate?: string; checklist?: ChecklistItem[]; }
const API_URL = 'http://localhost:3000/api/tasks';

const BoardView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentFocusTask, setCurrentFocusTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => { try { const response = await fetch(API_URL); if (!response.ok) throw new Error('Błąd sieci'); const data = await response.json(); setTasks(data); } catch (error) { toast.error("Nie udało się pobrać zadań."); } };
  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = async () => { if (inputText.trim() === '') return; const addTaskPromise = fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: inputText }), }).then(response => { if (!response.ok) throw new Error('Odpowiedź serwera nie była poprawna.'); return response.json(); }); toast.promise(addTaskPromise, { loading: 'Dodawanie zadania...', success: (newTask) => { setTasks([newTask, ...tasks]); setInputText(''); return <b>Zadanie dodane!</b>; }, error: <b>Nie udało się dodać zadania.</b>, }); };
  const handleMoveTask = async (id: string, e: React.MouseEvent) => { e.stopPropagation(); const taskToMove = tasks.find(task => task._id === id); if (!taskToMove) return; let nextStatus: Task['status'] | undefined; if (taskToMove.status === 'todo') nextStatus = 'inprogress'; if (taskToMove.status === 'inprogress') nextStatus = 'done'; if (!nextStatus) return; try { const response = await fetch(`${API_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }), }); if (!response.ok) throw new Error('Błąd podczas przesuwania zadania'); const updatedTask = await response.json(); setTasks(tasks.map(task => task._id === id ? updatedTask : task)); toast.success('Zadanie przesunięte!'); } catch (error) { toast.error('Nie udało się przesunąć zadania.'); } };
  const handleArchiveDoneTasks = async () => { const archivePromise = fetch(`${API_URL}/archive-done`, { method: 'POST', }).then(response => { if (!response.ok) throw new Error('Błąd podczas archiwizacji'); return response.json(); }); toast.promise(archivePromise, { loading: 'Archiwizowanie...', success: () => { fetchTasks(); return <b>Ukończone zadania zarchiwizowane!</b>; }, error: <b>Wystąpił błąd.</b>, }); };
  const handleUpdateTask = async (updatedTask: Task) => { try { const response = await fetch(`${API_URL}/${updatedTask._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedTask), }); if (!response.ok) throw new Error("Błąd zapisu"); const savedTask = await response.json(); setTasks(tasks.map(task => task._id === savedTask._id ? savedTask : task)); } catch (error) { toast.error("Nie udało się zapisać zmian."); } };
  const handleDeleteTask = async (taskId: string) => { try { const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' }); if (!response.ok) throw new Error("Błąd podczas usuwania"); setTasks(tasks.filter(task => task._id !== taskId)); } catch (error) { toast.error("Nie udało się usunąć zadania."); } };
  const handleStartFocus = (task: Task, e: React.MouseEvent) => { e.stopPropagation(); setCurrentFocusTask(task); setIsFocusMode(true); };
  const handleEndFocus = () => { setIsFocusMode(false); setCurrentFocusTask(null); };
  const openModal = (task: Task) => { setSelectedTask(task); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedTask(null); };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  
  const renderTaskBadges = (task: Task) => {
    const checklistProgress = task.checklist && task.checklist.length > 0 ? `${task.checklist.filter(i => i.completed).length}/${task.checklist.length}` : null;
    return (
      <div className="task-badges">
        {task.dueDate && ( <span className="badge due-date-badge"><FaRegCalendarAlt /> {format(new Date(task.dueDate), 'd MMM')}</span> )}
        {checklistProgress && ( <span className="badge checklist-badge"><FaCheckSquare /> {checklistProgress}</span> )}
      </div>
    );
  };

  return (
    <>
      <header className="app-header">
        <h1>FocusFlow</h1>
        <div className="task-input-form">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Wpisz nowe zadanie..." />
          <button onClick={handleAddTask}>Dodaj zadanie</button>
        </div>
      </header>
      <main className="board">
        <div className="column">
          <h2>Do zrobienia ({todoTasks.length})</h2>
          {todoTasks.map(task => ( <div key={task._id} className="task-card" onClick={() => openModal(task)}><p>{task.text}</p>{renderTaskBadges(task)}<div className="card-buttons"><button onClick={(e) => handleMoveTask(task._id, e)} className="move-button">Przesuń →</button></div></div> ))}
        </div>
        <div className="column">
          <h2>W trakcie ({inProgressTasks.length})</h2>
          {inProgressTasks.map(task => ( <div key={task._id} className="task-card" onClick={() => openModal(task)}><p>{task.text}</p>{renderTaskBadges(task)}<div className="card-buttons"><button onClick={(e) => handleStartFocus(task, e)} className="focus-button">Start Focus</button><button onClick={(e) => handleMoveTask(task._id, e)} className="move-button">Przesuń →</button></div></div>))}
        </div>
        <div className="column">
          <div className="column-header">
            <h2>Zrobione ({doneTasks.length})</h2>
            {doneTasks.length > 0 && ( <button onClick={handleArchiveDoneTasks} className="clear-button">Wyczyść</button> )}
          </div>
          {doneTasks.map(task => ( <div key={task._id} className="task-card" onClick={() => openModal(task)}><p>{task.text}</p>{renderTaskBadges(task)}</div> ))}
        </div>
      </main>
      {isFocusMode && currentFocusTask && ( <FocusMode taskText={currentFocusTask.text} onClose={handleEndFocus} /> )}
      {isModalOpen && selectedTask && ( <TaskModal task={selectedTask} onClose={closeModal} onSave={handleUpdateTask} onDelete={handleDeleteTask} /> )}
    </>
  );
};

export default BoardView;