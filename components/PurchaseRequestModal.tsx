
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Printer, ShoppingCart, Hash, MessageSquare, History, PlusCircle } from 'lucide-react';
import { Task, TaskStatus, TaskType, Importance, PurchaseItem, TaskLog } from '../types';
import { STATUS_MAP } from '../constants';

interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Task | null;
}

const PurchaseRequestModal: React.FC<PurchaseRequestModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    category: 'purchase',
    subCategory: 'توريد عام',
    assignee: '',
    importance: Importance.HIGH,
    type: TaskType.WORKFLOW,
    status: TaskStatus.AWAITING_APPROVAL,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    logs: [],
    purchaseData: {
      serialNumber: `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: 'السيد- مدير عام مجمع الأمل الحديث الطبي',
      items: [{ id: '1', name: '', unit: '', quantity: 1, price: 0, itemCode: '', total: 0 }],
      terms: ['التسليم بمقر المجمع', 'مطابقة المواصفات المعتمدة'],
      grandTotal: 0
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const calculateTotals = (items: PurchaseItem[]) => {
    const updatedItems = items.map(item => ({
      ...item,
      total: (Number(item.quantity) || 0) * (Number(item.price) || 0)
    }));
    const grandTotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
    return { updatedItems, grandTotal };
  };

  const handleUpdateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    const pData = formData.purchaseData!;
    const items = pData.items.map(item => item.id === id ? { ...item, [field]: value } : item);
    const { updatedItems, grandTotal } = calculateTotals(items);
    
    setFormData({
      ...formData,
      purchaseData: { ...pData, items: updatedItems, grandTotal }
    });
  };

  const addItem = () => {
    const pData = formData.purchaseData!;
    const newItem = { id: Math.random().toString(), name: '', unit: '', quantity: 1, price: 0, itemCode: '', total: 0 };
    setFormData({
      ...formData,
      purchaseData: { ...pData, items: [...pData.items, newItem] }
    });
  };

  const removeItem = (id: string) => {
    const pData = formData.purchaseData!;
    if (pData.items.length === 1) return;
    const items = pData.items.filter(item => item.id !== id);
    const { updatedItems, grandTotal } = calculateTotals(items);
    setFormData({
      ...formData,
      purchaseData: { ...pData, items: updatedItems, grandTotal }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TaskLog = {
      id: Math.random().toString(),
      user: 'أحمد العلي (المدير)',
      action: initialData ? `تحديث الطلب [${STATUS_MAP[formData.status!].label}]` : 'إنشاء طلب شراء جديد',
      timestamp: new Date().toLocaleString('ar-SA')
    };

    const taskToSave = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      createdAt: formData.createdAt || new Date().toISOString(),
      logs: [...(formData.logs || []), newLog],
      progress: formData.status === TaskStatus.APPROVED ? 100 : 20
    } as Task;

    onSave(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[95vh] no-print">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">تحرير طلب شراء توريد</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Hash size={10} /> {formData.purchaseData?.serialNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-black border border-slate-700"><Printer size={16} /> طباعة PDF</button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800 rounded-xl"><X size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[#0f172a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest">الموجه إليه</label>
              <input type="text" value={formData.purchaseData?.recipient} onChange={e => setFormData({...formData, purchaseData: {...formData.purchaseData!, recipient: e.target.value}})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-blue-500 outline-none" />
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest">موضوع الطلب</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest">التاريخ</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-bold" /></div>
              <div><label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest">مقدم الطلب</label><input type="text" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-bold" /></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between"><h4 className="text-white font-black text-sm">بيان الأصناف المطلوبة</h4><button type="button" onClick={addItem} className="flex items-center gap-2 text-blue-500 hover:text-blue-400 text-xs font-black transition-colors"><PlusCircle size={16} /> إضافة صنف</button></div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-inner">
              <table className="w-full text-right">
                <thead className="bg-slate-800/50 text-[10px] font-black text-slate-400 border-b border-slate-800">
                  <tr><th className="p-4 w-12">م</th><th className="p-4">الصنف</th><th className="p-4 w-24">الوحدة</th><th className="p-4 w-24">الكمية</th><th className="p-4 w-32">السعر</th><th className="p-4 w-32">المجموع</th><th className="p-4 w-12"></th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {formData.purchaseData?.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-800/20 group">
                      <td className="p-2 text-center text-slate-600 text-xs font-bold">{index + 1}</td>
                      <td className="p-2"><input type="text" value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-blue-500 px-2 py-1 text-white text-xs font-bold outline-none" placeholder="اسم الصنف..." /></td>
                      <td className="p-2"><input type="text" value={item.unit} onChange={e => handleUpdateItem(item.id, 'unit', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-blue-500 px-2 py-1 text-white text-xs font-bold outline-none text-center" /></td>
                      <td className="p-2"><input type="number" value={item.quantity} onChange={e => handleUpdateItem(item.id, 'quantity', Number(e.target.value))} className="w-full bg-transparent border-b border-transparent focus:border-blue-500 px-2 py-1 text-white text-xs font-bold outline-none text-center" /></td>
                      <td className="p-2"><input type="number" value={item.price} onChange={e => handleUpdateItem(item.id, 'price', Number(e.target.value))} className="w-full bg-transparent border-b border-transparent focus:border-blue-500 px-2 py-1 text-white text-xs font-bold outline-none text-center" /></td>
                      <td className="p-2 text-center text-blue-400 text-xs font-black">{item.total.toLocaleString()}</td>
                      <td className="p-2"><button type="button" onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-600/5"><td colSpan={5} className="p-4 text-left text-slate-400 font-bold text-xs">الإجمالي الكلي:</td><td className="p-4 text-center text-blue-500 font-black text-lg">{formData.purchaseData?.grandTotal.toLocaleString()}</td><td></td></tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-black text-sm flex items-center gap-2"><MessageSquare size={18} className="text-blue-500" /> ملاحظات إضافية</h4>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-[1.5rem] px-6 py-5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-h-[120px] resize-none transition-all placeholder:text-slate-600 shadow-inner" placeholder="مبررات طلب الشراء والمواصفات الفنية..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h4 className="text-white font-black text-sm mb-3">الاشتراطات العامة:</h4>
              <div className="space-y-3">
                {formData.purchaseData?.terms.map((term, i) => (
                  <div key={i} className="flex items-center gap-3"><span className="text-slate-600 font-bold text-xs">{i + 1} /</span><input type="text" value={term} onChange={e => { const newTerms = [...formData.purchaseData!.terms]; newTerms[i] = e.target.value; setFormData({...formData, purchaseData: {...formData.purchaseData!, terms: newTerms}}); }} className="flex-1 bg-transparent border-b border-slate-800 text-slate-300 text-xs py-1 focus:border-blue-500 outline-none" /></div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end space-y-6">
              <div className="w-full p-6 bg-slate-800/50 border border-slate-700 rounded-3xl flex justify-between items-center shadow-lg"><span className="text-slate-400 font-black text-xs uppercase tracking-widest">تحديث الحالة</span><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-black text-white outline-none focus:border-blue-500"> {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)} </select></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">حفظ واعتماد الطلب</button>
            </div>
          </div>
        </form>
      </div>

      <div id="purchase-print-template" className="hidden print:block print:fixed print:inset-0 print:bg-white print:text-black print:p-[1.5cm] print:direction-rtl print:w-full">
        <style>{`@media print { body { background: white !important; } .no-print { display: none !important; } #purchase-print-template { display: block !important; } .print-table th, .print-table td { border: 1px solid black !important; padding: 10px !important; text-align: center !important; font-size: 12px !important; } }`}</style>
        <div className="flex justify-between items-center mb-10 border-b-2 border-black pb-4">
          <div className="text-right"><h1 className="text-2xl font-black text-[#1B3F94]">مجمع الأمل الطبي</h1><p className="text-md font-bold text-[#ED1C24]">Al-Amal Medical Polyclinic</p></div>
          <div className="text-left text-sm font-bold"><p>التاريخ: {formData.date}</p><p>الرقم: {formData.purchaseData?.serialNumber}</p></div>
        </div>
        <div className="text-center mb-8"><h2 className="text-xl font-black underline underline-offset-8">طلب تعميد وتوريد أصناف</h2></div>
        <table className="w-full border-collapse mb-8 print-table">
          <thead><tr className="bg-gray-100"><th className="w-12">م</th><th>الـــصـــنــــف</th><th className="w-24">الوحدة</th><th className="w-24">الكمية</th><th className="w-32">السعر</th><th className="w-32">المجموع</th></tr></thead>
          <tbody>{formData.purchaseData?.items.map((item, i) => ( <tr key={i}><td>{i + 1}</td><td className="text-right px-4 font-bold">{item.name}</td><td>{item.unit}</td><td>{item.quantity}</td><td>{item.price}</td><td className="font-bold">{item.total.toLocaleString()}</td></tr> ))}</tbody>
          <tfoot><tr className="bg-gray-50 font-black"><td colSpan={5} className="text-left px-4">الإجمالي الكلي:</td><td className="text-center">{formData.purchaseData?.grandTotal.toLocaleString()} ر.س</td></tr></tfoot>
        </table>
        {formData.notes && <div className="mb-8 border border-black p-4 rounded-lg"><h3 className="font-black text-sm mb-2 underline">ملاحظات إضافية:</h3><p className="text-xs whitespace-pre-wrap leading-relaxed">{formData.notes}</p></div>}
        <div className="grid grid-cols-3 gap-8 mt-16 text-center font-black text-sm"><div><p className="border-b-2 border-black pb-2 mb-12">مقدم الطلب</p><p>{formData.assignee}</p></div><div><p className="border-b-2 border-black pb-2 mb-12">الإدارة المالية</p></div><div><p className="border-b-2 border-black pb-2 mb-12">مدير المنشأة</p>{formData.status === TaskStatus.APPROVED && <div className="text-blue-600 italic">تم الاعتماد إلكترونياً</div>}</div></div>
      </div>
    </div>
  );
};

export default PurchaseRequestModal;
