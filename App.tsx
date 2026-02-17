
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ListTodo, Calendar as CalendarIcon, 
  Settings, Search, Filter, Plus, FileDown, 
  LogOut, Bell, Sparkles, ChevronRight, ChevronLeft,
  LayoutGrid, List, BarChart3, TrendingUp, AlertCircle,
  Users, Activity, Heart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';

import { Task, TaskStatus, TaskType, Importance } from './types';
import { CATEGORIES, STATUS_MAP, IMPORTANCE_MAP } from './constants';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import PurchaseRequestModal from './components/PurchaseRequestModal';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'مراجعة التقرير المالي الأسبوعي',
    category: 'finance',
    subCategory: 'تقارير مالية',
    importance: Importance.HIGH,
    type: TaskType.DAILY,
    status: TaskStatus.IN_PROGRESS,
    date: new Date().toISOString().split('T')[0],
    notes: 'التأكد من مطابقة الأرصدة مع البنك',
    assignee: 'أحمد العلي',
    progress: 45,
    checklist: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'طلب إجازة سنوية - د. سارة',
    category: 'leaves',
    subCategory: 'إجازة سنوية',
    importance: Importance.MEDIUM,
    type: TaskType.WORKFLOW,
    status: TaskStatus.AWAITING_APPROVAL,
    date: new Date().toISOString().split('T')[0],
    notes: 'طلبت إجازة لمدة 10 أيام ابتداءً من الشهر القادم',
    assignee: 'سارة محمد',
    progress: 10,
    checklist: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pr-1',
    title: 'توريد أدوية طوارئ ربع سنوي',
    category: 'purchase',
    subCategory: 'توريد أدوية',
    importance: Importance.CRITICAL,
    type: TaskType.WORKFLOW,
    status: TaskStatus.AWAITING_APPROVAL,
    date: new Date().toISOString().split('T')[0],
    notes: 'عاجل لتغطية عيادات الطوارئ',
    assignee: 'خالد عبد الله',
    progress: 20,
    checklist: [],
    createdAt: new Date().toISOString(),
    purchaseData: {
      serialNumber: 'PR-2024-1002',
      recipient: 'السيد- مدير عام مجمع االمل الحديث الطبي',
      items: [
        { id: 'item-1', name: 'DIPROFOS 2 ML', unit: 'امبول', quantity: 2, itemCode: 'DPR-01', total: 2 },
        { id: 'item-2', name: 'NEBULIZER M', unit: 'حبة', quantity: 50, itemCode: 'NEB-05', total: 50 }
      ],
      terms: ['التسليم خلال 48 ساعة', 'مطابقة المواصفات الفنية'],
      grandTotal: 52
    }
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('amal_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [activePage, setActivePage] = useState<'dashboard' | 'tasks' | 'calendar' | 'settings'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('amal_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المهمة؟')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    if (task.category === 'purchase') {
      setIsPurchaseModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.APPROVED).length;
    const pending = tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.AWAITING_APPROVAL).length;
    const overdue = tasks.filter(t => t.status === TaskStatus.OVERDUE).length;
    const urgent = tasks.filter(t => t.importance === Importance.CRITICAL || t.importance === Importance.HIGH).length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, overdue, urgent, completionRate };
  }, [tasks]);

  const sidebarItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'tasks', label: 'المهام والطلبات', icon: ListTodo },
    { id: 'calendar', label: 'التقويم', icon: CalendarIcon },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-['Noto_Kufi_Arabic']">
      <aside className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col z-20">
        <div className="p-8 flex flex-col items-center gap-4 border-b border-slate-800/50">
          <div className="relative group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-4 border-[#1B3F94]">
              <svg viewBox="0 0 100 100" className="w-14 h-14">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ED1C24" strokeWidth="6" strokeDasharray="180 360" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <path d="M50 30 C 40 20, 25 25, 25 40 C 25 60, 50 75, 50 75 C 50 75, 75 60, 75 40 C 75 25, 60 20, 50 30" fill="#ED1C24" />
                <path d="M35 45 L42 45 L45 35 L50 55 L55 45 L65 45" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30 65 Q 40 85 60 85 Q 80 85 90 65" fill="none" stroke="#1B3F94" strokeWidth="5" strokeLinecap="round" />
                <path d="M10 65 Q 20 85 40 85 Q 60 85 70 65" fill="none" stroke="#1B3F94" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#ED1C24] rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-white font-extrabold text-xl tracking-tight leading-tight">مجمع الأمل الطبي</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1 font-bold">Amal Medical Complex</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activePage === item.id 
                  ? 'bg-gradient-to-r from-[#1B3F94] to-[#254ea8] text-white shadow-xl shadow-blue-900/30 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={20} className={activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#ED1C24] transition-colors'} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/40 p-4 rounded-3xl border border-slate-700/50 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1B3F94]/20 border border-[#1B3F94]/30 flex items-center justify-center">
              <Users size={18} className="text-[#1B3F94]" />
            </div>
            <div>
              <p className="text-slate-100 text-sm font-bold">أحمد العلي</p>
              <p className="text-slate-500 text-[10px] font-bold">مدير العمليات التشغيلية</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-[#ED1C24] transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-bold">خروج آمن</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 glass-panel border-b border-slate-800/60 px-10 flex items-center justify-between z-10">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-lg group">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1B3F94] transition-colors" size={20} />
              <input
                type="text"
                placeholder="ابحث عن مهام طبية، طلبات شراء، أو جولات تفتيش..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-14 pl-6 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B3F94]/50 focus:border-[#1B3F94] text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-800">
              <span className="text-slate-500 text-xs font-bold">حالة النظام:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-500 text-xs font-black">متصل</span>
              </div>
            </div>
            
            <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl transition-all relative group">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-3 h-3 bg-[#ED1C24] rounded-full border-2 border-slate-900"></span>
            </button>

            <div className="flex gap-2">
                <button
                    onClick={() => { setEditingTask(null); setIsPurchaseModalOpen(true); }}
                    className="bg-[#1B3F94] hover:bg-[#153275] text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02]"
                >
                    <Plus size={20} />
                    طلب شراء
                </button>
                <button
                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                    className="bg-[#ED1C24] hover:bg-[#c4151b] text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02]"
                >
                    <Plus size={20} />
                    مهمة جديدة
                </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#020617]">
          {activePage === 'dashboard' && <Dashboard tasks={tasks} stats={stats} />}
          {activePage === 'tasks' && (
            <TaskList 
              tasks={tasks} 
              searchQuery={searchQuery} 
              onEdit={handleEdit}
              onDelete={deleteTask}
              onStatusChange={(id, status) => {
                const task = tasks.find(t => t.id === id);
                if (task) updateTask({ ...task, status });
              }}
            />
          )}
          {activePage === 'calendar' && <CalendarView tasks={tasks} />}
          {activePage === 'settings' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in">
              <Settings size={80} className="mb-6 opacity-10 text-[#1B3F94]" />
              <h2 className="text-2xl font-black text-white/50">إعدادات النظام</h2>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
          onSave={editingTask ? updateTask : addTask}
          initialData={editingTask}
        />
      )}

      {isPurchaseModalOpen && (
        <PurchaseRequestModal 
          isOpen={isPurchaseModalOpen}
          onClose={() => { setIsPurchaseModalOpen(false); setEditingTask(null); }}
          onSave={editingTask ? updateTask : addTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default App;
