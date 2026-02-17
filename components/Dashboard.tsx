
import React, { useMemo } from 'react';
import { 
  CheckCircle, Clock, AlertTriangle, 
  TrendingUp, ListTodo, Activity, Target,
  AlertCircle, HeartPulse, Stethoscope, Wallet
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { Task, DashboardStats, TaskStatus } from '../types';
import { CATEGORIES, STATUS_MAP } from '../constants';

interface DashboardProps {
  tasks: Task[];
  stats: DashboardStats;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, stats }) => {
  const financialSummary = useMemo(() => {
    const approvedPurchases = tasks.filter(t => t.category === 'purchase' && t.status === TaskStatus.APPROVED);
    const total = approvedPurchases.reduce((acc, curr) => acc + (curr.purchaseData?.grandTotal || 0), 0);
    return total;
  }, [tasks]);

  const categoryData = useMemo(() => {
    const data = CATEGORIES.map(cat => ({
      name: cat.label,
      value: tasks.filter(t => t.category === cat.id).length,
      color: cat.color
    })).filter(c => c.value > 0);
    
    // Return empty array if no tasks, but Recharts prefers a placeholder if empty to avoid resize warnings
    return data.length > 0 ? data : [{ name: 'لا يوجد بيانات', value: 0, color: '#1e293b' }];
  }, [tasks]);

  const statusData = useMemo(() => {
    const data = Object.entries(STATUS_MAP).map(([key, val]) => ({
      name: val.label,
      value: tasks.filter(t => t.status === key).length,
      color: val.color
    })).filter(s => s.value > 0);

    return data.length > 0 ? data : [{ name: 'لا يوجد بيانات', value: 0, color: '#1e293b' }];
  }, [tasks]);

  const StatCard = ({ title, value, subValue, icon: Icon, color, trend, brandColor }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group shadow-xl transition-all duration-300 hover:border-slate-700">
      <div 
        className="absolute top-0 right-0 w-40 h-40 -mr-12 -mt-12 opacity-5 rounded-full blur-3xl transition-all duration-500 group-hover:opacity-15"
        style={{ backgroundColor: brandColor || '#3b82f6' }}
      ></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div 
          className="p-4 rounded-2xl border transition-colors"
          style={{ backgroundColor: `${brandColor || '#3b82f6'}10`, borderColor: `${brandColor || '#3b82f6'}30` }}
        >
          <Icon size={28} style={{ color: brandColor || '#3b82f6' }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-[#ED1C24] bg-red-500/10'}`}>
            <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-slate-400 text-sm font-bold mb-2 tracking-wide uppercase">{title}</h3>
        <p className="text-white text-4xl font-black tracking-tight mb-2">{value}</p>
        <p className="text-slate-500 text-xs font-bold">{subValue}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="إجمالي المشتريات المعتمدة" 
          value={`${financialSummary.toLocaleString()} ر.س`} 
          subValue="سيولة الطلبات المعتمدة" 
          icon={Wallet} 
          brandColor="#1B3F94" 
        />
        <StatCard 
          title="معدل الإنجاز" 
          value={`${stats.completionRate}%`} 
          subValue={`${stats.completed} مهمة مغلقة`} 
          icon={CheckCircle} 
          brandColor="#10b981" 
          trend={4}
        />
        <StatCard 
          title="بلاغات حرجة" 
          value={stats.urgent} 
          subValue="تحتاج تدخل فوري" 
          icon={AlertCircle} 
          brandColor="#ED1C24" 
          trend={-12}
        />
        <StatCard 
          title="قيد العمل" 
          value={stats.pending} 
          subValue="بانتظار المتابعة" 
          icon={Clock} 
          brandColor="#f59e0b" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-white mb-2">توزيع النشاط التشغيلي</h3>
              <p className="text-slate-500 text-sm font-medium">حجم المهام والطلبات لكل قسم</p>
            </div>
          </div>
          {/* Explicit height and minWidth={0} fixed Recharts resize errors */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={categoryData}>
                <defs>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B3F94" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1B3F94" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="value" stroke="#1B3F94" strokeWidth={4} fillOpacity={1} fill="url(#colorBrand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8">حالات المهام</h3>
          {/* Use minHeight to ensure parent stability for ResponsiveContainer */}
          <div className="flex-1 min-h-[250px] relative w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
             {statusData.map((s, i) => (
               <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                  {s.name} ({s.value})
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
