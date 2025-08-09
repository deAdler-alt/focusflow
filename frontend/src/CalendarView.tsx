import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { toast } from 'react-hot-toast';

interface CalendarEvent {
    title: string;
    start: string;
}

const API_URL = 'http://localhost:3000/api/tasks/calendar';

const CalendarView = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchCalendarTasks = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Błąd pobierania zadań do kalendarza");
                const tasks = await response.json();
                
                const formattedEvents = tasks.map((task: any) => ({
                    title: task.text,
                    start: task.dueDate,
                }));
                setEvents(formattedEvents);

            } catch (error) {
                toast.error("Nie udało się załadować kalendarza.");
            }
        };
        fetchCalendarTasks();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px' }}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={events}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                height="auto"
            />
        </div>
    );
};

export default CalendarView;