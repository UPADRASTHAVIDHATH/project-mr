import React, { useState } from 'react';
import { Shield, X, User, Lock, Mail, Phone, Heart, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, onSwitchDemoUser }) {
  const [tab, setTab] = useState('switch'); // 'switch', 'login', 'register'
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');
  
  // Registration State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [consentStore, setConsentStore] = useState(true);
  const [consentLocation, setConsentLocation] = useState(true);
  const [consentAlert, setConsentAlert] = useState(true);

  if (!isOpen) return null;

  const demoProfiles = [
    {
      id: 1,
      name: "John Doe",
      age: 52,
      gender: "Male",
      blood: "A+",
      history: "Chest discomfort (12 Aug 2026), Hypertension, Angina",
      allergies: "Penicillin",
      desc: "Cardiovascular Risk Profile • Ideal for Heart Triage Demo"
    },
    {
      id: 2,
      name: "Priya Sharma",
      age: 28,
      gender: "Female",
      blood: "B+",
      history: "Chronic Asthma, Seasonal Bronchospasm",
      allergies: "Dust Mites",
      desc: "Respiratory Distress Profile • Shortness of Breath Demo"
    },
    {
      id: 3,
      name: "Ramesh Kumar",
      age: 68,
      gender: "Male",
      blood: "O+",
      history: "Type 2 Diabetes, Stage-2 Hypertension",
      allergies: "Sulfa Drugs",
      desc: "Geriatric Metabolic Profile • Dizziness & Syncope Demo"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Patient Authentication & Profile Center</h2>
              <p className="text-xs text-slate-400">Secure JWT Authentication & Medical Consent</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-2 my-4 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTab('switch')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'switch' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Quick Demo Profiles
          </button>
          <button
            onClick={() => setTab('login')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔐 Sign In (JWT)
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              tab === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📝 Register & Consent
          </button>
        </div>

        {/* Tab 1: Quick Demo Profiles */}
        {tab === 'switch' && (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            <p className="text-xs text-slate-300 mb-2">
              Select a pre-seeded patient profile to instantly test history correlation and risk logic:
            </p>

            {demoProfiles.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSwitchDemoUser(p);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white group-hover:text-blue-400 transition">
                      {p.name} ({p.age}Y, {p.gender})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                      Blood: {p.blood}
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-400 font-semibold group-hover:underline">
                    Load Patient →
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-1">{p.desc}</p>
                <div className="text-[11px] text-slate-500">
                  <span className="text-slate-400 font-semibold">History:</span> {p.history} | <span className="text-red-400 font-semibold">Allergies:</span> {p.allergies}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Standard Login */}
        {tab === 'login' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin({ email, password });
              onClose();
            }}
            className="space-y-4 py-2"
          >
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-white w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <Lock className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm text-white w-full focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition"
            >
              Sign In to Project M.R
            </button>
          </form>
        )}

        {/* Tab 3: Register with Explicit Consent System */}
        {tab === 'register' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRegister({
                full_name: fullName || 'New Patient',
                email: regEmail || 'patient@example.com',
                password: 'password123',
                phone: regPhone || '+91 98765 11111',
                age: Number(age),
                gender,
                blood_group: bloodGroup,
                height_cm: Number(height),
                weight_kg: Number(weight),
                store_health_data: consentStore,
                share_location_emergency: consentLocation,
                contact_emergency_contacts: consentAlert
              });
              onClose();
            }}
            className="space-y-4 overflow-y-auto flex-1 pr-1 py-1"
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aditi Rao"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="aditi@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Medical Consent System (Requirement #2) */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 text-xs space-y-2">
              <span className="font-extrabold text-blue-400 block mb-1">
                🛡️ Explicit Medical & Emergency Consent
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" checked={consentStore} onChange={e => setConsentStore(e.target.checked)} className="accent-blue-500" />
                <span>Allow M.R to store and analyze health data securely</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" checked={consentLocation} onChange={e => setConsentLocation(e.target.checked)} className="accent-blue-500" />
                <span>Allow M.R to share GPS location only during an active emergency</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" checked={consentAlert} onChange={e => setConsentAlert(e.target.checked)} className="accent-blue-500" />
                <span>Allow M.R to contact emergency contacts upon safety verification timeout</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition"
            >
              Complete Registration & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
