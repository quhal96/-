
import React, { useState, useMemo } from 'react';
import { 
  Edit2, Trash, Filter, ArrowUpDown, ChevronRight,
  ChevronLeft, User, ArrowUp, ArrowDown, Printer, FileText, Hash, CheckCircle
} from 'lucide-react';
import { Task, TaskStatus, Importance } from '../types';
import { CATEGORIES, STATUS_MAP, IMPORTANCE_MAP } from '../constants';

interface TaskListProps {
  tasks: Task[];
  searchQuery: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

type SortKey = 'title' | 'assignee' | 'status' | 'importance' | 'date';
type SortDirection = 'asc' | 'desc';

const TaskList: React.FC<TaskListProps> = ({ tasks, searchQuery, onEdit, onDelete, onStatusChange }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'date',
    direction: 'desc'
  });

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>();
    tasks.forEach(task => {
      if (task.assignee) assignees.add(task.assignee);
    });
    return Array.from(assignees).sort();
  }, [tasks]);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const importanceOrder = {
    [Importance.CRITICAL]: 4,
    [Importance.HIGH]: 3,
    [Importance.MEDIUM]: 2,
    [Importance.LOW]: 1
  };

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.purchaseData?.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesCat = catFilter === 'all' || task.category === catFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
      
      return matchesSearch && matchesStatus && matchesCat && matchesAssignee;
    });

    return filtered.sort((a, b) => {
      let aVal: any = a[sortConfig.key] || '';
      let bVal: any = b[sortConfig.key] || '';

      if (sortConfig.key === 'importance') {
        aVal = importanceOrder[a.importance];
        bVal = importanceOrder[b.importance];
      } else if (sortConfig.key === 'status') {
        aVal = STATUS_MAP[a.status].label;
        bVal = STATUS_MAP[b.status].label;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, searchQuery, statusFilter, catFilter, assigneeFilter, sortConfig]);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in no-print">
      {/* Table Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-6 border border-slate-800 rounded-3xl backdrop-blur-md shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            <span className="text-slate-400 text-sm font-bold">تصفية العرض:</span>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 outline-none hover:border-slate-600 transition-all"
          >
            <option value="all">كل الحالات</option>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          <select 
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 outline-none hover:border-slate-600 transition-all"
          >
            <option value="all">كل الأقسام</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          <select 
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 outline-none hover:border-slate-600 transition-all"
          >
            <option value="all">كل الموظفين</option>
            {uniqueAssignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
        <div className="text-slate-500 text-xs font-bold bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          إجمالي النتائج: {filteredAndSortedTasks.length}
        </div>
      </div>

      {/* Task Grid/Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="px-6 py-6 text-slate-400 font-black text-xs uppercase cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">المهمة / الطلب <SortIndicator column="title" /></div>
                </th>
                <th className="px-6 py-6 text-slate-400 font-black text-xs uppercase cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('assignee')}>
                  <div className="flex items-center gap-2">المسؤول <SortIndicator column="assignee" /></div>
                </th>
                <th className="px-6 py-6 text-slate-400 font-black text-xs uppercase cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">الحالة <SortIndicator column="status" /></div>
                </th>
                <th className="px-6 py-6 text-slate-400 font-black text-xs uppercase cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('importance')}>
                  <div className="flex items-center gap-2">الأهمية <SortIndicator column="importance" /></div>
                </th>
                <th className="px-6 py-6 text-slate-400 font-black text-xs uppercase cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">التاريخ <SortIndicator column="date" /></div>
                </th>
                <th className="px-6 py-6 text-slate-400 font-black text-xs uppercase">الخيارات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAndSortedTasks.length > 0 ? filteredAndSortedTasks.map((task) => {
                const status = STATUS_MAP[task.status];
                const importance = IMPORTANCE_MAP[task.importance];
                const category = CATEGORIES.find(c => c.id === task.category);
                const isPurchase = task.category === 'purchase';
                
                return (
                  <tr key={task.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-sm group-hover:text-[#1B3F94] transition-colors">{task.title}</span>
                          {isPurchase && (
                            <span className="bg-blue-900/40 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded border border-blue-800/50 flex items-center gap-1">
                              <Hash size={10} /> {task.purchaseData?.serialNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color }}></div>
                          <span className="text-slate-500 text-[10px] font-bold">{category?.label}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <User size={14} className="text-slate-500" />
                        </div>
                        <span className="text-slate-300 text-xs font-bold">{task.assignee || 'غير مسند'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select 
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className="bg-transparent border-none text-[10px] font-black px-2 py-1 rounded-xl cursor-pointer hover:bg-slate-700 transition-all outline-none"
                        style={{ color: status.color, backgroundColor: `${status.bg}` }}
                      >
                        {Object.entries(STATUS_MAP).map(([k, v]) => (
                          <option key={k} value={k} className="bg-slate-900 text-white">{v.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold" style={{ color: importance.color }}>
                        <importance.icon size={14} />
                        {importance.label}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-400 text-xs font-mono">{task.date}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(task)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl"
                          title="تعديل"
                        >
                          <Edit2 size={16} />
                        </button>
                        {isPurchase && (
                          <button 
                            onClick={() => onEdit(task)}
                            className="p-2 text-blue-400 hover:text-white hover:bg-[#1B3F94] rounded-xl"
                            title="طباعة الطلب"
                          >
                            <Printer size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => onDelete(task.id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                          title="حذف"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center text-slate-600 italic">
                    <FileText size={48} className="mx-auto mb-4 opacity-10" />
                    لا توجد بيانات متاحة لعرضها حالياً...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Amal Medical Information System v1.2</span>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-800 text-slate-500 rounded-xl cursor-not-allowed"><ChevronRight size={18} /></button>
            <button className="p-2 bg-slate-800 text-slate-500 rounded-xl cursor-not-allowed"><ChevronLeft size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
