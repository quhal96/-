
import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, MoreVertical } from 'lucide-react';
import { Task } from '../types';
import { CATEGORIES } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Adjust for RTL/Friday start if needed, here we use standard JS indexing
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getTasksForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.date === dateStr);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-slate-900 p-6 border border-slate-800 rounded-3xl">
        <h2 className="text-xl font-bold text-white">{monthName}</h2>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(1)} className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700">
            <ChevronRight size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white hover:bg-slate-700 text-sm font-bold">
            اليوم
          </button>
          <button onClick={() => changeMonth(-1)} className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700">
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-800/30">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-collapse">
          {daysInMonth.map((day, idx) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const isToday = day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div 
                key={idx} 
                className={`min-h-[140px] p-2 border-l border-b border-slate-800 last:border-l-0 ${
                  day ? 'bg-slate-900/40 hover:bg-slate-800/20 transition-colors' : 'bg-slate-950/20'
                }`}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg ${
                        isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-slate-500'
                      }`}>
                        {day}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[10px] text-slate-600 font-black">{dayTasks.length}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 overflow-y-auto max-h-[100px]">
                      {dayTasks.map(task => {
                        const cat = CATEGORIES.find(c => c.id === task.category);
                        return (
                          <div 
                            key={task.id} 
                            className="px-2 py-1 rounded-md text-[9px] font-bold text-white/90 truncate cursor-pointer hover:scale-[1.02] transition-transform"
                            style={{ backgroundColor: `${cat?.color}40`, borderRight: `2px solid ${cat?.color}` }}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
