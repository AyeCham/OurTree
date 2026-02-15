import React, { useState } from 'react';
import { NewRequestForm } from '../../types';
import { COLORS } from '../../constants';

interface RequestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequest: (form: NewRequestForm) => void;
}

const RequestBookModal: React.FC<RequestBookModalProps> = ({ isOpen, onClose, onRequest }) => {
  const [newRequest, setNewRequest] = useState<NewRequestForm>({ title: "", author: "", requester: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequest(newRequest);
    setNewRequest({ title: "", author: "", requester: "" });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in zoom-in duration-300">
      <div className="bg-white w-full max-sm:max-w-full max-w-md rounded-[50px] shadow-2xl p-12">
        <h2 className="text-xl font-black mb-8 text-center text-slate-800">စာအုပ်တောင်းဆိုရန်</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">စာအုပ်အမည်</label>
            <input 
              required 
              placeholder="စာအုပ်အမည်ကို ရိုက်ထည့်ပါ" 
              className="w-full px-7 py-5 rounded-3xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 border-none shadow-inner" 
              style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties}
              value={newRequest.title} 
              onChange={e => setNewRequest({...newRequest, title: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">စာရေးဆရာအမည်</label>
            <input 
              required 
              placeholder="စာရေးဆရာအမည်ကို ရိုက်ထည့်ပါ" 
              className="w-full px-7 py-5 rounded-3xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 border-none shadow-inner" 
              style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties}
              value={newRequest.author} 
              onChange={e => setNewRequest({...newRequest, author: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">သင့်အမည် (တောင်းဆိုသူ)</label>
            <input 
              required 
              placeholder="သင့်အမည်ကို ရိုက်ထည့်ပါ" 
              className="w-full px-7 py-5 rounded-3xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 border-none shadow-inner" 
              style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties}
              value={newRequest.requester} 
              onChange={e => setNewRequest({...newRequest, requester: e.target.value})} 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-5 rounded-3xl text-white font-black shadow-xl active:scale-95 transition-all mt-6" 
            style={{ backgroundColor: COLORS.primary }}
          >
            တောင်းဆိုချက် ပေးပို့မည်
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full py-2 text-slate-300 text-[10px] font-black uppercase mt-2 text-center"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestBookModal;