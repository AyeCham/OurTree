import React, { useState } from 'react';
import { Book, BookRequest } from '../types';
import { Plus, Trash2, Search, BookOpen, MessageSquare, CheckCircle, Pencil, Database, RefreshCw } from 'lucide-react';
import { COLORS } from '../constants';

interface AdminDashboardProps {
  books: Book[];
  requests: BookRequest[];
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => void;
  onDeleteRequest: (id: number) => void;
  onResetData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ books, requests, onAddBook, onEditBook, onDeleteBook, onDeleteRequest, onResetData }) => {
  const [activeTab, setActiveTab] = useState<'books' | 'requests' | 'settings'>('books');
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Trigger internal Docker sync script
  const handleSync = async () => {
    if (!confirm("စာအုပ်အသစ်များ ရယူရန် သေချာပါသလား?")) return;

    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync', { method: 'POST' });

      if (response.ok) {
        alert("အပ်ဒိတ်လုပ်ခြင်း အောင်မြင်ပါသည်။ စာမျက်နှာအား ပြန်ဖွင့်ပါမည်။");
        window.location.reload(); 
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      alert("Error: မာစတာကွန်ပျူတာနှင့် ချိတ်ဆက်၍မရပါ။ Tailscale နှင့် Server အား စစ်ဆေးပါ။");
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{books.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total Books</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{requests.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Requests</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => setActiveTab('books')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'books' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Manage Books</button>
        <button onClick={() => setActiveTab('requests')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'requests' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Manage Requests</button>
        <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Settings</button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">

        {/* Books Manager */}
        {activeTab === 'books' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search books..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={onAddBook} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-black text-xs uppercase" style={{ backgroundColor: COLORS.primary }}>
                <Plus size={16} /> Add New Book
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4">Title</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold text-slate-400">#{book.id}</td>
                      <td className="py-4 px-4 font-bold text-slate-700">{book.title}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onEditBook(book)} className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Pencil size={16} /></button>
                          <button onClick={() => { if (confirm(`Delete "${book.title}"?`)) onDeleteBook(book.id); }} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Manager */}
        {activeTab === 'requests' && (
          <div className="p-6 space-y-4">
            {requests.map(req => (
              <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div><h4 className="font-bold">{req.title}</h4><p className="text-xs text-slate-500">By {req.requester}</p></div>
                <button onClick={() => onDeleteRequest(req.id)} className="p-2 text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Settings / Sync Manager */}
        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-black text-slate-700">Database & Sync Settings</h3>
            
            {/* Sync Now Section */}
            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                  <RefreshCw className={isSyncing ? "animate-spin" : ""} size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800">Cloud Sync (Zero-Touch)</h4>
                  <p className="text-xs text-slate-500 mt-2">မာစတာကွန်ပျူတာမှ စာအုပ်အသစ်များကို ဤနေရာသို့ တိုက်ရိုက်ရယူမည်။</p>
                  <button onClick={handleSync} disabled={isSyncing} className={`mt-6 flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all ${isSyncing ? 'bg-slate-300' : 'bg-orange-500 text-white shadow-lg active:scale-95'}`}>
                    <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Updating..." : "Sync Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Section */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><Database size={24} /></div>
                <div>
                  <h4 className="font-black text-slate-800">Reset Database</h4>
                  <p className="text-xs text-slate-500 mt-2">This will reset books to Factory Defaults (SAMPLE_BOOKS).</p>
                  <button onClick={() => { if(confirm("Are you sure?")) onResetData(); }} className="mt-6 flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase shadow-lg">Reset Defaults</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;