
import React from 'react';
import { 
  Clipboard, Award, Eye, Megaphone, Users, 
  TrendingUp, Briefcase, Shield, CheckCircle, 
  Clock, AlertTriangle, XCircle, FileText,
  ArrowUpCircle, MinusCircle, ArrowDownCircle,
  Stethoscope, Syringe, ClipboardList, HeartPulse,
  ShoppingCart
} from 'lucide-react';
import { TaskStatus, Importance } from './types';

export const CATEGORIES = [
  { id: "purchase", label: "طلبات الشراء", icon: ShoppingCart, color: "#1B3F94", subCategories: ["توريد أدوية", "أدوات طبية", "قرطاسية", "صيانة وأجهزة"] },
  { id: "leaves", label: "شؤون الموظفين والإجازات", icon: Users, color: "#1B3F94", subCategories: ["إجازة سنوية", "إجازة مرضية", "إجازة اضطرارية", "تعديل رصيد"] },
  { id: "medical_ops", label: "العمليات الطبية", icon: Stethoscope, color: "#ED1C24", subCategories: ["تجهيز غرف", "مراجعة بروتوكول", "طلبات أدوية", "مواعيد الطوارئ"] },
  { id: "achievement", label: "التحقيقات والإنجازات", icon: Award, color: "#f59e0b", subCategories: ["تحقيق إداري", "تحقيق طبي", "تميز ربع سنوي"] },
  { id: "followup", label: "جولات المتابعة", icon: HeartPulse, color: "#22c55e", subCategories: ["جولة النظافة", "سلامة المرضى", "تفتيش المخازن"] },
  { id: "advertising", label: "التسويق والعروض", icon: Megaphone, color: "#ec4899", subCategories: ["عروض الليزر", "فحوصات شاملة", "حملات توعية"] },
  { id: "finance", label: "المالية والتحصيل", icon: TrendingUp, color: "#1B3F94", subCategories: ["مطالبات تأمين", "تقفيل وردية", "مشتريات طبية"] },
  { id: "operations", label: "الصيانة والتشغيل", icon: Briefcase, color: "#f97316", subCategories: ["صيانة أجهزة", "تراخيص صحية", "تجهيزات هندسية"] },
  { id: "compliance", label: "الجودة والامتثال", icon: Shield, color: "#14b8a6", subCategories: ["معايير سباهي", "تدقيق داخلي", "مكافحة عدوى"] }
];

export const STATUS_MAP: Record<TaskStatus, { label: string, color: string, bg: string, icon: any }> = {
  [TaskStatus.DRAFT]: { label: "مسودة", color: "#94a3b8", bg: "#1e293b", icon: FileText },
  [TaskStatus.PENDING]: { label: "قيد الانتظار", color: "#64748b", bg: "#1e293b", icon: Clock },
  [TaskStatus.IN_PROGRESS]: { label: "جاري التنفيذ", color: "#1B3F94", bg: "#1b3f9420", icon: Clock },
  [TaskStatus.SUBMITTED]: { label: "تم الرفع", color: "#8b5cf6", bg: "#2d1b69", icon: FileText },
  [TaskStatus.AWAITING_APPROVAL]: { label: "بانتظار الاعتماد", color: "#f59e0b", bg: "#422006", icon: AlertTriangle },
  [TaskStatus.APPROVED]: { label: "معتمد", color: "#22c55e", bg: "#14532d", icon: CheckCircle },
  [TaskStatus.REJECTED]: { label: "مرفوض", color: "#ED1C24", bg: "#450a0a", icon: XCircle },
  [TaskStatus.COMPLETED]: { label: "تم الإنجاز", color: "#10b981", bg: "#064e3b", icon: CheckCircle },
  [TaskStatus.CANCELLED]: { label: "ملغي", color: "#6b7280", bg: "#1f2937", icon: XCircle },
  [TaskStatus.OVERDUE]: { label: "متأخر جداً", color: "#ED1C24", bg: "#4c0519", icon: AlertTriangle },
};

export const IMPORTANCE_MAP: Record<Importance, { label: string, color: string, icon: any }> = {
  [Importance.CRITICAL]: { label: "حرج جداً", color: "#ED1C24", icon: AlertTriangle },
  [Importance.HIGH]: { label: "عالية", color: "#f43f5e", icon: ArrowUpCircle },
  [Importance.MEDIUM]: { label: "متوسطة", color: "#f59e0b", icon: MinusCircle },
  [Importance.LOW]: { label: "منخفضة", color: "#22c55e", icon: ArrowDownCircle },
};
