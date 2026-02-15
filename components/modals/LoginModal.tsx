import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { COLORS } from '../../constants';
import { LoginForm } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (form: LoginForm) => string | null; // Returns error string or null if success
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onLogin(form);
    if (result) {
      setError(result);
    } else {
      // Success
      setForm({ username: "", password: "" });
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-sm:max-w-full max-w-sm rounded-[50px] shadow-2xl overflow-hidden">
        <div className="p-12 text-center bg-slate-50">
          <Lock size={40} className="mx-auto mb-6 text-indigo-600 opacity-20" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-12 space-y-5">
          {error && (
            <p className="text-[10px] font-black text-red-500 text-center bg-red-50 p-3 rounded-2xl">
              {error}
            </p>
          )}
          <input 
            type="text" 
            placeholder="Admin ID" 
            required 
            className="w-full px-6 py-5 rounded-3xl bg-slate-100 font-bold text-sm outline-none focus:ring-4" 
            style={{ '--tw-ring-color': COLORS.primary + '20' } as React.CSSProperties}
            value={form.username} 
            onChange={e => setForm({...form, username: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="w-full px-6 py-5 rounded-3xl bg-slate-100 font-bold text-sm outline-none focus:ring-4" 
            style={{ '--tw-ring-color': COLORS.primary + '20' } as React.CSSProperties}
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <button 
            type="submit" 
            className="w-full py-5 rounded-3xl text-white font-black text-sm shadow-xl mt-4 active:scale-95 transition-all" 
            style={{ backgroundColor: COLORS.primary }}
          >
            LOGIN
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full py-2 text-slate-300 text-[10px] font-black uppercase text-center mt-2"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;