import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Book as BookIcon, Brain, Sun, Users, MessageSquare as MsgIcon, Microscope, Settings, Palette, PenTool, Map, ArrowDownAZ, ArrowUpAZ, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import BookCard from './components/BookCard';
import BookDetail from './components/BookDetail';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/modals/LoginModal';
import AddBookModal from './components/modals/AddBookModal';
import RequestBookModal from './components/modals/RequestBookModal';

import { Book, BookRequest, LoginForm, NewBookForm, NewRequestForm, Tab } from './types';
import { COLORS, DDC_CATEGORIES, SAMPLE_BOOKS, STORAGE_KEY, REQUEST_STORAGE_KEY, DATA_VERSION, VERSION_KEY } from './constants';

const iconMap: Record<string, React.ReactNode> = {
  book: <BookIcon size={40} className="mb-2" />,
  brain: <Brain size={40} className="mb-2" />,
  sun: <Sun size={40} className="mb-2" />,
  users: <Users size={40} className="mb-2" />,
  "message-square": <MsgIcon size={40} className="mb-2" />,
  microscope: <Microscope size={40} className="mb-2" />,
  settings: <Settings size={40} className="mb-2" />,
  palette: <Palette size={40} className="mb-2" />,
  "pen-tool": <PenTool size={40} className="mb-2" />,
  map: <Map size={40} className="mb-2" />
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedDDC, setSelectedDDC] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [sortBy, setSortBy] = useState<"title" | "author" | "ddc">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // MODIFIED LOAD LOGIC: Fetch from Volume first
  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2800);

    const initializeData = async () => {
      try {
        const savedRequestsStr = localStorage.getItem(REQUEST_STORAGE_KEY);
        let loadedBooks: Book[] = [];

        // 1. Try to fetch from Docker Volume / M.2
        try {
          const response = await fetch('/books/library_data.json');
          if (response.ok) {
            loadedBooks = await response.json();
            console.log("Books loaded from sync volume.");
          } else {
            throw new Error("No volume data");
          }
        } catch (e) {
          // 2. Fallback to LocalStorage or Sample Books
          const savedBooksStr = localStorage.getItem(STORAGE_KEY);
          loadedBooks = savedBooksStr ? JSON.parse(savedBooksStr) : [...SAMPLE_BOOKS];
          console.warn("Using fallback data.");
        }

        const savedVersion = localStorage.getItem(VERSION_KEY);
        if (savedVersion !== DATA_VERSION) {
          const existingIds = new Set(loadedBooks.map(b => b.id));
          SAMPLE_BOOKS.forEach(sampleBook => {
            if (!existingIds.has(sampleBook.id)) loadedBooks.push(sampleBook);
          });
          localStorage.setItem(VERSION_KEY, DATA_VERSION);
        }

        setBooks(loadedBooks);
        if (savedRequestsStr) setRequests(JSON.parse(savedRequestsStr));
        setIsLoaded(true);
      } catch (error) {
        console.error("Load failed:", error);
        setBooks(SAMPLE_BOOKS);
        setIsLoaded(true);
      }
    };

    initializeData();
    return () => clearTimeout(splashTimer);
  }, []);

  // Save Data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
    }
  }, [books, requests, isLoaded]);

  const notify = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDDC = selectedDDC === "All" || book.ddc === selectedDDC;
    return matchesSearch && matchesDDC;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
      case 'ddc':
        comparison = a.ddc.localeCompare(b.ddc);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const mostReadBooks = books.filter(b => b.isFeatured);

  const handleLogin = (form: LoginForm): string | null => {
    if (form.username === "admin" && form.password === "ourtrees123") {
      setIsAdmin(true);
      setShowLoginModal(false);
      // Automatically go to dashboard on login
      setActiveTab("admin_dashboard");
      notify("Admin Mode သို့ ဝင်ရောက်ပြီးပါပြီ");
      return null;
    } else {
      return "အသုံးပြုသူအမည် သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်။";
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab("home");
    notify("Admin Mode မှ ထွက်လိုက်ပါပြီ");
  };

  const handleAddBook = (newBookData: NewBookForm) => {
    const bookToAdd: Book = {
      ...newBookData,
      id: Date.now(),
      status: "ရရှိနိုင်သည်"
    };
    setBooks(prev => [...prev, bookToAdd]);
    setIsAddBookModalOpen(false);
    notify("စာအုပ်အသစ် ထည့်သွင်းပြီးပါပြီ");
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsAddBookModalOpen(true);
  };

  const handleUpdateBook = (updatedData: NewBookForm) => {
    if (!editingBook) return;

    setBooks(prev => prev.map(book =>
      book.id === editingBook.id
        ? { ...book, ...updatedData }
        : book
    ));

    setIsAddBookModalOpen(false);
    setEditingBook(null);
    notify("စာအုပ်အချက်အလက်ကို ပြင်ဆင်ပြီးပါပြီ");
  };

  const handleDeleteBook = (id: number) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    notify("စာအုပ်ကို ဖျက်ပြီးပါပြီ");
  };

  const handleDeleteRequest = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    notify("တောင်းဆိုချက်ကို ဖယ်ရှားပြီးပါပြီ");
  };

  // Hard Reset / Force Sync Function for Admin
  const handleResetDatabase = () => {
    setBooks([...SAMPLE_BOOKS]);
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
    notify("Database reset to defaults.");
  };

  const handleAddRequest = (newRequestData: NewRequestForm) => {
    const reqToAdd: BookRequest = {
      ...newRequestData,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };
    setRequests(prev => [...prev, reqToAdd]);
    setIsRequestModalOpen(false);
    notify("စာအုပ်တောင်းဆိုမှုကို လက်ခံရရှိပါပြီ");
  };

  const exportData = () => {
    const data = { books, requests, exportDate: new Date().toISOString() };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "our_trees_library_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    notify("Backup File ဒေါင်းလုဒ်ဆွဲပြီးပါပြီ");
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.bgLight }}>
      <Header
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        onExport={exportData}
        onResetView={() => { setViewingBook(null); setActiveTab("home"); setSearchTerm(""); }}
        onOpenDashboard={() => { setViewingBook(null); setActiveTab("admin_dashboard"); }}
      />

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {viewingBook ? (
          <BookDetail book={viewingBook} onBack={() => setViewingBook(null)} />
        ) : activeTab === 'admin_dashboard' && isAdmin ? (
          /* Admin Dashboard View */
          <AdminDashboard
            books={books}
            requests={requests}
            onAddBook={() => { setEditingBook(null); setIsAddBookModalOpen(true); }}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
            onDeleteRequest={handleDeleteRequest}
            onResetData={handleResetDatabase}
          />
        ) : (
          /* Public View */
          <>
            <div className="relative mb-10 max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="စာအုပ်အမည်၊ စာရေးဆရာဖြင့် ရှာဖွေပါ..."
                className="w-full pl-16 pr-6 py-5 rounded-[40px] border-none shadow-xl focus:ring-4 outline-none text-base font-bold bg-white"
                style={{ '--tw-ring-color': COLORS.primary + '30' } as React.CSSProperties}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {!searchTerm && (
              <div className="flex justify-center gap-2 mb-12 overflow-x-auto no-scrollbar py-2">
                {(["home", "browse", "requests"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSelectedDDC("All"); }}
                    className={`px-12 py-3.5 rounded-full text-[11px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab ? "text-white shadow-xl shadow-orange-200" : "bg-white text-slate-400"}`}
                    style={activeTab === tab ? { backgroundColor: COLORS.primary } : {}}
                  >
                    {tab === "home" ? "ပင်မ" : tab === "browse" ? "စာအုပ်စင်" : "တောင်းဆိုချက်"}
                  </button>
                ))}
              </div>
            )}

            {(activeTab === "home" || activeTab === "browse" || activeTab === "list" || searchTerm !== "") && (
              <div className="space-y-16 animate-in slide-in-from-bottom-4">

                {/* Most Read Section - Only on Home tab and when not searching */}
                {activeTab === "home" && !searchTerm && mostReadBooks.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-6 px-2">
                      <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
                      <TrendingUp size={24} className="text-slate-700" />
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">အဖတ်အများဆုံးစာအုပ်များ</h2>
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-8 px-2 -mx-2 no-scrollbar snap-x snap-mandatory">
                      {mostReadBooks.map(book => (
                        <div key={book.id} className="snap-start shrink-0">
                          <BookCard
                            book={book}
                            isAdmin={isAdmin}
                            onClick={setViewingBook}
                            onDelete={handleDeleteBook}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "browse" && !searchTerm && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {DDC_CATEGORIES.map(cat => (
                      <button
                        key={cat.code}
                        onClick={() => { setSelectedDDC(cat.code); setActiveTab("list"); }}
                        className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl transition-all border-b-8 flex flex-col items-center gap-3 active:scale-95"
                        style={{ borderBottomColor: cat.color }}
                      >
                        {iconMap[cat.iconName]}
                        <div className="text-center font-black">
                          <div className="text-[10px] text-slate-300 uppercase">{cat.code}</div>
                          <div className="text-xs text-slate-700">{cat.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {(activeTab === "home" || activeTab === "list" || searchTerm !== "") && (
                  <div className="space-y-6">
                    {/* Sort Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {activeTab === "home" && !searchTerm ? "All Books" : ""} {filteredBooks.length} {filteredBooks.length <= 1 ? "Book" : "Books"} Found
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "title" | "author" | "ddc")}
                            className="bg-white text-xs font-bold text-slate-600 py-2.5 pl-4 pr-8 rounded-xl border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer"
                          >
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="ddc">DDC</option>
                          </select>
                          {/* Custom Arrow */}
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>

                        <button
                          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm text-slate-500 hover:text-orange-500 transition-colors active:scale-95"
                          title={sortOrder === 'asc' ? "Sort Ascending" : "Sort Descending"}
                        >
                          {sortOrder === 'asc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-16 gap-x-4 pb-20">
                      {filteredBooks.length > 0 ? (
                        filteredBooks.map(book => (
                          <BookCard
                            key={book.id}
                            book={book}
                            isAdmin={isAdmin}
                            onClick={setViewingBook}
                            onDelete={handleDeleteBook}
                          />
                        ))
                      ) : (
                        <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest opacity-50">
                          စာအုပ်များ မရှိသေးပါ
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "requests" && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 text-center">
                  <MessageSquare size={40} className="mx-auto mb-6 text-orange-500 opacity-20" />
                  <h3 className="text-xl font-black text-slate-800 mb-4">စာအုပ်အသစ် တောင်းဆိုခြင်း</h3>
                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="w-full py-5 rounded-3xl font-black text-white shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    စာအုပ်အမည် ပေးပို့မည်
                  </button>
                </div>
                {requests.map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-[30px] shadow-sm border-l-8" style={{ borderLeftColor: COLORS.primary }}>
                    <div className="font-bold text-slate-700 text-lg">{req.title}</div>
                    <div className="text-slate-500 text-sm font-bold mt-1">စာရေးဆရာ - {req.author}</div>
                    <div className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-tight italic tracking-widest opacity-60">
                      တောင်းဆိုသူ: {req.requester} • {req.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Add Button - Only show on home/list view for Admins, hidden in dashboard since dashboard has its own button */}
      {isAdmin && !viewingBook && activeTab !== 'admin_dashboard' && (
        <button
          onClick={() => { setEditingBook(null); setIsAddBookModalOpen(true); }}
          className="fixed bottom-10 right-8 w-16 h-16 rounded-[28px] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 shadow-[#DB8C29]/30"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus size={32} />
        </button>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => { setIsAddBookModalOpen(false); setEditingBook(null); }}
        onAdd={handleAddBook}
        onUpdate={handleUpdateBook}
        bookToEdit={editingBook}
      />

      <RequestBookModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequest={handleAddRequest}
      />

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-[70] animate-in slide-in-from-bottom-5">
          {showNotification}
        </div>
      )}
    </div>
  );
};

export default App;