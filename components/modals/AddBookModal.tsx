import React, { useState, useEffect } from 'react';
import { NewBookForm, Book } from '../../types';
import { COLORS, DDC_CATEGORIES } from '../../constants';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: NewBookForm) => void;
  onUpdate?: (book: NewBookForm) => void;
  bookToEdit?: Book | null;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd, onUpdate, bookToEdit }) => {
  const [formData, setFormData] = useState<NewBookForm>({ 
    title: "", author: "", ddc: "000", isFeatured: false, year: "", coverUrl: "", pdfUrl: "" 
  });

  // Populate form if editing
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        ddc: bookToEdit.ddc,
        isFeatured: bookToEdit.isFeatured,
        year: bookToEdit.year,
        coverUrl: bookToEdit.coverUrl,
        pdfUrl: bookToEdit.pdfUrl
      });
    } else {
      setFormData({ title: "", author: "", ddc: "000", isFeatured: false, year: "", coverUrl: "", pdfUrl: "" });
    }
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookToEdit && onUpdate) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    setFormData({ title: "", author: "", ddc: "000", isFeatured: false, year: "", coverUrl: "", pdfUrl: "" });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in zoom-in duration-300">
      <div className="bg-white w-full max-md:max-w-full max-w-md rounded-[50px] shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-black mb-8">
          {bookToEdit ? "စာအုပ်အချက်အလက် ပြင်ရန်" : "စာအုပ်အသစ်ထည့်ရန်"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required 
            placeholder="စာအုပ်အမည်" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-bold text-sm border-none outline-none" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
          <input 
            required 
            placeholder="စာရေးဆရာ" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-bold text-sm border-none outline-none" 
            value={formData.author} 
            onChange={e => setFormData({...formData, author: e.target.value})} 
          />
          <select 
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-bold text-sm border-none outline-none" 
            value={formData.ddc} 
            onChange={e => setFormData({...formData, ddc: e.target.value})}
          >
            {DDC_CATEGORIES.map(cat => (
              <option key={cat.code} value={cat.code}>{cat.code} - {cat.label}</option>
            ))}
          </select>
          <input 
            placeholder="Cover Image URL (ရှိလျှင်)" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-bold text-sm border-none outline-none" 
            value={formData.coverUrl} 
            onChange={e => setFormData({...formData, coverUrl: e.target.value})} 
          />
          <input 
            placeholder="PDF File Link (ရှိလျှင်)" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-bold text-sm border-none outline-none" 
            value={formData.pdfUrl} 
            onChange={e => setFormData({...formData, pdfUrl: e.target.value})} 
          />
          <div className="flex items-center gap-2 p-3 text-xs font-bold text-slate-500">
            <input 
              type="checkbox" 
              checked={formData.isFeatured} 
              onChange={e => setFormData({...formData, isFeatured: e.target.checked})} 
            />
            Featured List ထဲထည့်မည်
          </div>
          <button 
            type="submit" 
            className="w-full py-5 rounded-2xl text-white font-black shadow-xl active:scale-95 transition-all" 
            style={{ backgroundColor: COLORS.primary }}
          >
            {bookToEdit ? "ပြင်ဆင်မှုများ သိမ်းဆည်းမည်" : "သိမ်းဆည်းမည်"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full py-2 text-slate-300 text-xs font-black text-center mt-2 uppercase"
          >
            CANCEL
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;