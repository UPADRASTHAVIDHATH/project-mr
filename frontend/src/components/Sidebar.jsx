import React from 'react';
import { 
  Shield, LayoutDashboard, HeartPulse, FileText, Calendar, 
  Scale, ShieldCheck, Stethoscope, Users, User, LogIn, AlertTriangle, CheckCircle2 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userProfile, onOpenAuth, emergencyState }) {
  const isEmergency = emergencyState?.status === 'EMERGENCY_ACTIVE';
  const isVerifying = emergencyState?.status === 'VERIFYING';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'report', label: 'Report a Problem', icon: HeartPulse, badge: isVerifying ? 'Verifying' : null },
    { id: 'history', label: 'Medical History', icon: FileText, badge: '3 Records' },
    { id: 'timeline', label: 'Health Timeline', icon: Calendar, badge: '2026' },
    { id: 'wellness', label: 'BMI & Wellness', icon: Scale, badge: `${userProfile?.bmi || '25.9'}` },
    { id: 'insurance', label: 'Insurance & Policies', icon: ShieldCheck, badge: 'Active' },
    { id: 'doctor', label: 'Doctor / Paramedic', icon: Stethoscope, badge: 'Handoff' },
    { id: 'contact_view', label: 'Family Receiver View', icon: Users, badge: '5 Contacts' },
  ];

  return (
    <aside className="w-64 bg-[#0c101a] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30 shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">PROJECT M.R</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400">Intelligent Emergency Engine</p>
        </div>
      </div>

      {/* Active Monitoring Status Card */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System Status</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              isEmergency ? 'bg-red-400' : isVerifying ? 'bg-yellow-400' : 'bg-emerald-400'
            } opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isEmergency ? 'bg-red-500' : isVerifying ? 'bg-yellow-500' : 'bg-emerald-500'
            }`}></span>
          </span>
        </div>
        <div className="font-bold text-slate-200">
          {isEmergency ? '🚨 EMERGENCY ACTIVE' : isVerifying ? '🟡 SAFETY VERIFYING' : '🟢 M.R MONITORING ACTIVE'}
        </div>
      </div>

      {/* Vertical Navigation Items */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          Navigation Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Account / Profile Switcher Footer */}
      <div className="p-3 border-t border-slate-800/80">
        <div 
          onClick={onOpenAuth}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 cursor-pointer transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
              {userProfile?.full_name?.charAt(0) || 'J'}
            </div>
            <div>
              <span className="font-bold text-xs text-white block group-hover:text-blue-400 transition">
                {userProfile?.full_name || 'John Doe'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {userProfile?.blood_group || 'A+'} • {userProfile?.age || 52}Y
              </span>
            </div>
          </div>

          <button 
            title="Sign In / Switch Account" 
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition"
          >
            <LogIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
