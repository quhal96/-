
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckSquare, Plus, Trash2, HeartPulse, User } from 'lucide-react';
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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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

  const selectedCat = CATEGORIES.find(c => c.id === formData.category);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] animate-fade-in">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1B3F94]/10 rounded-2xl flex items-center justify-center text-[#1B3F94] border border-[#1B3F94]/20 shadow-inner">
              <HeartPulse size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{initialData ? 'تعديل سجل المهمة' : 'إضافة مهمة تشغيلية جديدة'}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Amal Medical Information System</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Basic Info */}
          <div className="space-y-6">
            <div className="group">
              <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest group-focus-within:text-[#1B3F94] transition-colors">عنوان المهمة / الإجراء الطبي *</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#1B3F94]/50 focus:border-[#1B3F94] transition-all"
                placeholder="أدخل مسمى واضح للمهمة..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">القسم المسؤول *</label>
                <select 
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value, subCategory: ''})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#1B3F94]/50 appearance-none transition-all"
                >
                  <option value="">اختر القسم المختص</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">الموظف المسؤول (Assignee)</label>
                <div className="relative">
                  <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text"
                    value={formData.assignee}
                    onChange={e => setFormData({...formData, assignee: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pr-12 pl-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#1B3F94]/50 focus:border-[#1B3F94] transition-all"
                    placeholder="اسم الموظف..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workflow & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50">
              <label className="block text-slate-500 text-[9px] font-black mb-3 uppercase tracking-widest">طبيعة المهمة</label>
              <div className="flex flex-col gap-2">
                {[TaskType.DAILY, TaskType.MONTHLY, TaskType.WORKFLOW].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, type})}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${
                      formData.type === type 
                      ? 'bg-[#1B3F94] border-[#1B3F94] text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                    }`}
                  >
                    {type === TaskType.DAILY ? 'يومية ثابتة' : type === TaskType.MONTHLY ? 'شهرية دورية' : 'إجرائية / Workflow'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50">
              <label className="block text-slate-500 text-[9px] font-black mb-3 uppercase tracking-widest">مستوى الأهمية</label>
              <div className="flex flex-col gap-2">
                {Object.entries(IMPORTANCE_MAP).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFormData({...formData, importance: k as Importance})}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border flex items-center justify-between ${
                      formData.importance === k 
                      ? 'bg-slate-900 border-white text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 opacity-60 hover:opacity-100'
                    }`}
                    style={formData.importance === k ? { borderColor: v.color, color: v.color } : {}}
                  >
                    {v.label}
                    <v.icon size={12} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50">
              <label className="block text-slate-500 text-[9px] font-black mb-3 uppercase tracking-widest">تاريخ الاستحقاق</label>
              <input 
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-[#1B3F94]"
              />
              <p className="mt-4 text-[9px] text-slate-600 leading-relaxed font-bold italic">
                * المهام الحرجة تتطلب إغلاقاً فورياً خلال 24 ساعة حسب سياسة المجمع.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">ملاحظات طبية / توصيات التنفيذ</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-[1.5rem] px-6 py-5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1B3F94]/50 focus:border-[#1B3F94] min-h-[120px] resize-none transition-all placeholder:text-slate-600"
              placeholder="اكتب التوصيات الخاصة بهذه المهمة لضمان جودة الأداء..."
            />
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-500">
              <AlertCircle size={14} />
              <span className="text-[9px] font-bold">الحقول المميزة بـ (*) إلزامية لحفظ السجل</span>
            </div>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-8 py-3.5 rounded-2xl text-slate-400 font-black text-xs hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
              >
                إغلاق
              </button>
              <button 
                type="submit"
                className="bg-[#1B3F94] hover:bg-[#254ea8] text-white px-10 py-3.5 rounded-2xl font-black text-xs flex items-center gap-3 shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
              >
                <Save size={18} />
                اعتماد وحفظ السجل
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
