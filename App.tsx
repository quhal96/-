
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ListTodo, Calendar as CalendarIcon, 
  Settings, Search, Filter, Plus, FileDown, 
  LogOut, Bell, Sparkles, ChevronRight, ChevronLeft,
  LayoutGrid, List, BarChart3, TrendingUp, AlertCircle,
  Users, Activity, Heart, Download, ShieldCheck, Monitor
} from 'lucide-react';

import { Task, TaskStatus, TaskType, Importance, TaskLog } from './types';
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
    createdAt: new Date().toISOString(),
    logs: [{ id: 'l1', user: 'النظام', action: 'إنشاء المهمة تلقائياً', timestamp: new Date().toLocaleString('ar-SA') }]
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
  
  // PWA Install Logic
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('amal_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const addTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المهمة نهائياً من سجلات المجمع؟')) {
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

  const exportToCSV = () => {
    const headers = ['المهمة', 'القسم', 'الحالة', 'الأهمية', 'المسؤول', 'التاريخ', 'الإجمالي'];
    const rows = tasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${CATEGORIES.find(c => c.id === t.category)?.label || t.category}"`,
      `"${STATUS_MAP[t.status].label}"`,
      `"${IMPORTANCE_MAP[t.importance].label}"`,
      `"${t.assignee || 'غير مسند'}"`,
      t.date,
      t.purchaseData?.grandTotal || 0
    ]);

    const csvContent = [
      '\uFEFF' + headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `amal_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-['Noto_Kufi_Arabic'] select-none">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0f172a] border-l border-slate-800 flex flex-col z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)] no-print">
        <div className="p-10 flex flex-col items-center gap-6 border-b border-slate-800/50">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden border-4 border-[#1B3F94] hover:scale-105 transition-transform cursor-pointer">
              <Activity size={48} className="text-[#ED1C24]" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-[#0f172a] flex items-center justify-center shadow-lg">
               <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-white font-black text-2xl tracking-tight">مجمع الأمل الطبي</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">Amal Medical Information System</p>
          </div>
        </div>

        <nav className="flex-1 px-6 py-10 space-y-3 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
            { id: 'tasks', label: 'سجل المهام', icon: ListTodo },
            { id: 'calendar', label: 'الجدول الزمني', icon: CalendarIcon },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 group ${
                activePage === item.id 
                  ? 'bg-gradient-to-r from-[#1B3F94] to-[#153275] text-white shadow-2xl shadow-blue-950/40 translate-x-2' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <item.icon size={22} className={activePage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-[#ED1C24]'} />
              <span className="font-black text-sm tracking-wide">{item.label}</span>
            </button>
          ))}

          {installPrompt && (
            <button
              onClick={handleInstallClick}
              className="w-full mt-6 flex items-center gap-4 px-6 py-5 bg-emerald-500/10 text-emerald-400 rounded-3xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group animate-pulse"
            >
              <Monitor size={22} />
              <div className="text-right">
                <span className="block font-black text-sm">تثبيت البرنامج</span>
                <span className="block text-[9px] font-bold opacity-70 italic">للوصول السريع من سطح المكتب</span>
              </div>
            </button>
          )}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-[#0c1222]">
          <div className="bg-slate-800/20 p-5 rounded-[1.5rem] border border-slate-700/30 flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1B3F94]/10 border border-[#1B3F94]/20 flex items-center justify-center text-[#1B3F94]">
              <Users size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-slate-100 text-sm font-black truncate">أحمد العلي</p>
              <p className="text-slate-500 text-[10px] font-bold">المشرف العام</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 text-slate-500 hover:text-[#ED1C24] hover:bg-red-500/5 rounded-2xl transition-all font-black text-xs">
            <LogOut size={18} />
            تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-28 bg-[#020617]/80 backdrop-blur-2xl border-b border-slate-800 px-12 flex items-center justify-between z-10 no-print">
          <div className="flex items-center gap-10 flex-1">
            <div className="relative w-full max-w-xl">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="ابحث برقم الطلب، اسم المهمة، أو الموظف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-16 pl-8 py-4 bg-[#0f172a] border border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-[#1B3F94]/40 focus:border-[#1B3F94] text-sm font-bold text-white shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={exportToCSV}
              className="group flex items-center gap-3 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-lg"
              title="تصدير التقارير"
            >
              <Download size={20} className="group-hover:bounce" />
              <span className="text-xs font-black uppercase tracking-widest">Reports</span>
            </button>
            
            <div className="h-10 w-px bg-slate-800"></div>

            <div className="flex gap-4">
                <button
                    onClick={() => { setEditingTask(null); setIsPurchaseModalOpen(true); }}
                    className="bg-[#1B3F94] hover:bg-[#153275] text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-[0_15px_30px_rgba(27,63,148,0.3)] transition-all active:scale-95 border border-blue-400/20"
                >
                    <Plus size={18} />
                    طلب شراء
                </button>
                <button
                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                    className="bg-[#ED1C24] hover:bg-[#c4151b] text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 shadow-[0_15px_30px_rgba(237,28,36,0.3)] transition-all active:scale-95 border border-red-400/20"
                >
                    <Plus size={18} />
                    مهمة جديدة
                </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[#020617] custom-scrollbar scroll-smooth">
          {activePage === 'dashboard' && <Dashboard tasks={tasks} stats={stats} />}
          {activePage === 'tasks' && (
            <TaskList 
              tasks={tasks} 
              searchQuery={searchQuery} 
              onEdit={handleEdit}
              onDelete={deleteTask}
              onStatusChange={(id, status) => {
                const task = tasks.find(t => t.id === id);
                if (task) {
                   const newLog: TaskLog = {
                      id: Math.random().toString(),
                      user: 'أحمد العلي (المدير)',
                      action: `تم تعديل حالة الطلب إلى [${STATUS_MAP[status].label}]`,
                      timestamp: new Date().toLocaleString('ar-SA')
                   };
                   updateTask({ ...task, status, logs: [...(task.logs || []), newLog] });
                }
              }}
            />
          )}
          {activePage === 'calendar' && <CalendarView tasks={tasks} />}
          {activePage === 'settings' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-700 animate-fade-in text-center max-w-lg mx-auto">
              <div className="w-40 h-40 bg-slate-900 rounded-[3rem] flex items-center justify-center mb-10 border border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                 <ShieldCheck size={80} className="text-[#1B3F94]" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">أمن النظام والإعدادات</h2>
              <p className="text-slate-500 font-bold leading-relaxed">بصفتك مديراً للنظام، ستتمكن قريباً من إدارة صلاحيات الموظفين، ربط الفروع، وتخصيص قوالب الطباعة من هذه الصفحة.</p>
              
              {installPrompt && (
                 <button 
                  onClick={handleInstallClick}
                  className="mt-10 px-10 py-4 bg-[#1B3F94] text-white rounded-2xl font-black text-xs shadow-2xl hover:bg-blue-600 transition-all"
                 >
                    تثبيت التطبيق على جهاز الكمبيوتر الآن
                 </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
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
