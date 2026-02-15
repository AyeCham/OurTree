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
        <button 
          onClick={() => setActiveTab('books')}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'books' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400'}`}
        >
          Manage Books
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'requests' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400'}`}
        >
          Manage Requests
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400'}`}
        >
          Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        
        {/* Books Manager */}
        {activeTab === 'books' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search books..." 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={onAddBook}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-black text-xs uppercase shadow-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus size={16} /> Add New Book
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest">
                    <th className="py-4 px-4 font-black">ID</th>
                    <th className="py-4 px-4 font-black">Title</th>
                    <th className="py-4 px-4 font-black">Author</th>
                    <th className="py-4 px-4 font-black">DDC</th>
                    <th className="py-4 px-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold text-slate-400">#{book.id}</td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-700">{book.title}</td>
                      <td className="py-4 px-4 text-xs font-bold text-slate-500">{book.author}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black">{book.ddc}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onEditBook(book)}
                            className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm(`Are you sure you want to delete "${book.title}"?`)) onDeleteBook(book.id);
                            }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBooks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-bold text-sm opacity-60">
                        No books found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Manager */}
        {activeTab === 'requests' && (
          <div className="p-6">
            <h3 className="text-lg font-black text-slate-700 mb-6">User Book Requests</h3>
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800">{req.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">Author: {req.author}</p>
                    <div className="mt-1 flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Requested by {req.requester}</span>
                       <span className="text-[10px] text-slate-400">{req.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <button 
                      onClick={() => onDeleteRequest(req.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                    <button 
                      onClick={() => {
                        onEditBook({
                           id: Date.now(),
                           title: req.title,
                           author: req.author,
                           ddc: "000",
                           isFeatured: false,
                           status: "ရရှိနိုင်သည်",
                           year: "",
                           coverUrl: "",
                           pdfUrl: ""
                        });
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md"
                    >
                      <CheckCircle size={14} /> Fulfill
                    </button>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="py-20 text-center text-slate-400 font-bold">
                  No pending requests.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings / Sync Manager */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="text-lg font-black text-slate-700 mb-6">Database & Sync Settings</h3>
            
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                     <Database size={24} />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-800 text-base">Reset Database</h4>
                     <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        This action will revert the local database to the default "Factory Settings" (SAMPLE_BOOKS). 
                        <br/><br/>
                        <span className="font-bold text-red-500">Warning:</span> All custom added books and changes will be lost. 
                        User requests will not be affected. Use this if the local data is corrupted or you want to start fresh 
                        after a major system update.
                     </p>
                     
                     <div className="mt-6 flex gap-3">
                        <button 
                           onClick={() => {
                              if(confirm("DANGER: This will delete all custom books and reset to defaults. Are you sure?")) onResetData();
                           }}
                           className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase shadow-lg transition-colors"
                        >
                           <RefreshCw size={14} /> Reset to Defaults
                        </button>
                     </div>
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