
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Plus, Trash2, HeartPulse, User, CheckSquare } from 'lucide-react';
import { Task, TaskStatus, TaskType, Importance } from '../types';
import { CATEGORIES, STATUS_MAP, IMPORTANCE_MAP } from '../constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    category: '',
    subCategory: '',
    assignee: '',
    importance: Importance.MEDIUM,
    type: TaskType.PERMANENT,
    status: TaskStatus.PENDING,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    checklist: [],
    progress: 0
  });

  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const addChecklistItem = () => {
    if (!newItemText.trim()) return;
    const newItem = { id: Math.random().toString(), text: newItemText, completed: false };
    setFormData({ ...formData, checklist: [...(formData.checklist || []), newItem] });
    setNewItemText('');
  };

  const removeChecklistItem = (id: string) => {
    setFormData({ ...formData, checklist: (formData.checklist || []).filter(i => i.id !== id) });
  };

  const toggleChecklistItem = (id: string) => {
    const updated = (formData.checklist || []).map(i => i.id === id ? { ...i, completed: !i.completed } : i);
    const completedCount = updated.filter(i => i.completed).length;
    const progress = updated.length ? Math.round((completedCount / updated.length) * 100) : 0;
    setFormData({ ...formData, checklist: updated, progress });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      alert('يرجى تعبئة الحقول الإلزامية');
      return;
    }

    const taskToSave = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      createdAt: formData.createdAt || new Date().toISOString(),
      checklist: formData.checklist || [],
      progress: formData.progress || 0
    } as Task;

    onSave(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1B3F94]/10 rounded-2xl flex items-center justify-center text-[#1B3F94] border border-[#1B3F94]/20"><HeartPulse size={24} /></div>
            <div><h3 className="text-xl font-black text-white">{initialData ? 'تعديل سجل المهمة' : 'إضافة مهمة تشغيلية'}</h3><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Amal Medical Information System</p></div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800 rounded-xl"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">عنوان المهمة *</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-[#1B3F94]/50 transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">القسم المسؤول *</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-[#1B3F94]/50 transition-all">
                  <option value="">اختر القسم</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div><label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">المسؤول</label><div className="relative"><User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-12 pl-5 py-4 text-white font-bold outline-none transition-all" /></div></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50 flex flex-col gap-2">
              <label className="block text-slate-500 text-[9px] font-black mb-2 uppercase tracking-widest">النوع</label>
              {[TaskType.DAILY, TaskType.MONTHLY, TaskType.WORKFLOW].map(type => (
                <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${formData.type === type ? 'bg-[#1B3F94] border-[#1B3F94] text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>{type === TaskType.DAILY ? 'يومية' : type === TaskType.MONTHLY ? 'شهرية' : 'إجرائية'}</button>
              ))}
            </div>
            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50 flex flex-col gap-2">
              <label className="block text-slate-500 text-[9px] font-black mb-2 uppercase tracking-widest">الأهمية</label>
              {Object.entries(IMPORTANCE_MAP).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setFormData({...formData, importance: k as Importance})} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border flex items-center justify-between ${formData.importance === k ? 'bg-slate-900 text-white' : 'bg-slate-900 border-slate-700 text-slate-500 opacity-60'}`} style={formData.importance === k ? { borderColor: v.color, color: v.color } : {}}>{v.label}<v.icon size={12} /></button>
              ))}
            </div>
            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50">
              <label className="block text-slate-500 text-[9px] font-black mb-2 uppercase tracking-widest">التاريخ</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none" />
            </div>
          </div>

          {/* Checklist Management */}
          <div className="space-y-4">
            <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest flex items-center gap-2"><CheckSquare size={14} className="text-blue-500" /> قائمة الخطوات التنفيذية (Checklist)</label>
            <div className="flex gap-2">
              <input type="text" value={newItemText} onChange={e => setNewItemText(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs font-bold outline-none focus:border-blue-500" placeholder="أضف خطوة تنفيذية..." />
              <button type="button" onClick={addChecklistItem} className="p-2 bg-[#1B3F94] text-white rounded-xl"><Plus size={20} /></button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {formData.checklist?.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-800 group">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleChecklistItem(item.id)}>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'}`}>{item.completed && <Save size={12} />}</div>
                    <span className={`text-xs font-bold ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{item.text}</span>
                  </div>
                  <button type="button" onClick={() => removeChecklistItem(item.id)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div><label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">التوصيات والملاحظات</label><textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-[1.5rem] px-6 py-5 text-white font-medium focus:ring-2 focus:ring-[#1B3F94]/50 outline-none min-h-[120px] resize-none transition-all shadow-inner" placeholder="اكتب التوصيات..." /></div>

          <div className="pt-6 flex justify-between items-center border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-500"><AlertCircle size={14} /><span className="text-[9px] font-bold">الحقول المميزة بـ (*) إلزامية</span></div>
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="px-8 py-3.5 rounded-2xl text-slate-400 font-black text-xs hover:text-white hover:bg-slate-800 transition-all">إغلاق</button>
              <button type="submit" className="bg-[#1B3F94] hover:bg-[#254ea8] text-white px-10 py-3.5 rounded-2xl font-black text-xs flex items-center gap-3 shadow-2xl transition-all"><Save size={18} /> حفظ السجل</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
