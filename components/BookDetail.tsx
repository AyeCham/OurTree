import React, { useState, useEffect } from 'react';
import { ArrowLeft, Book as BookIcon, Download, FileText, Maximize2, Minimize2, Loader2, RefreshCw, Globe, Monitor, Info, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { COLORS, DDC_CATEGORIES } from '../constants';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const [imgError, setImgError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  
  // Mobile Tab State: 'info' or 'reader'
  const [mobileTab, setMobileTab] = useState<'info' | 'reader'>('info');

  // Reset loading and tab when book changes
  useEffect(() => {
    setPdfLoading(true);
    setIframeKey(prev => prev + 1);
    setUseGoogleViewer(false); // Reset to native by default
    setMobileTab('info'); // Reset to info tab on new book
    setImgError(false); // Reset image error
  }, [book]);

  const getBookCoverColor = (ddc: string) => {
    const category = DDC_CATEGORIES.find(c => c.code === ddc);
    return category ? category.color : COLORS.primary;
  };

  const getProcessedCoverUrl = (url: string) => {
    if (!url) return "";
    try {
      // Google Drive Logic: Convert view/open links to thumbnail links for images
      if (url.includes('drive.google.com')) {
        const idMatch = url.match(/\/d\/([^/?]+)/) || url.match(/id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
        }
      }
      // Dropbox
      if (url.includes('dropbox.com')) {
        return url.replace('?dl=0', '?raw=1').replace('?dl=1', '?raw=1');
      }
    } catch (e) {
      return url;
    }
    return url;
  };

  const handleReloadPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    setPdfLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const toggleViewerMode = () => {
    setUseGoogleViewer(!useGoogleViewer);
    setPdfLoading(true);
  };

  const getViewerUrl = () => {
    let url = book.pdfUrl;
    
    if (!url) return "";

    // If using Google Docs Viewer wrapper
    if (useGoogleViewer) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }

    // Native Mode Smart Fixes
    // Handle Google Drive
    if (url.includes('drive.google.com')) {
      // Convert /view or /edit to /preview for embeddability
      return url.replace(/\/view.*/, '/preview').replace(/\/edit.*/, '/preview');
    }
    // Handle Dropbox
    if (url.includes('dropbox.com')) {
      return url.replace('?dl=0', '').replace('?dl=1', '') + '?raw=1';
    }

    return url;
  };

  const displayCoverUrl = getProcessedCoverUrl(book.coverUrl);
  const showCoverImage = book.coverUrl && !imgError;
  const isDriveLink = book.pdfUrl?.includes('drive.google.com');

  return (
    <div className="animate-in fade-in zoom-in duration-500 h-full flex flex-col">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-indigo-600 transition-colors active:scale-95 origin-left w-fit focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
        aria-label="Go back to book list"
      >
        <ArrowLeft size={24} aria-hidden="true" /> <span className="hidden sm:inline">နောက်သို့ပြန်သွားမည်</span><span className="sm:hidden">Back</span>
      </button>
      
      {/* Mobile Tabs */}
      <div 
        className="flex lg:hidden bg-white rounded-t-[30px] shadow-sm border-b border-slate-100 overflow-hidden mb-0"
        role="tablist"
        aria-label="Mobile view tabs"
      >
        <button 
          onClick={() => setMobileTab('info')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${mobileTab === 'info' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-50'}`}
          role="tab"
          aria-selected={mobileTab === 'info'}
          aria-controls="book-info-panel"
          id="tab-info"
        >
          <Info size={16} aria-hidden="true" /> Info
        </button>
        <button 
          onClick={() => setMobileTab('reader')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${mobileTab === 'reader' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-50'}`}
          role="tab"
          aria-selected={mobileTab === 'reader'}
          aria-controls="book-reader-panel"
          id="tab-reader"
        >
          <BookOpen size={16} aria-hidden="true" /> Reader
        </button>
      </div>

      <div className={`bg-white lg:rounded-[40px] rounded-b-[30px] rounded-t-none lg:rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300 ${isFullScreen ? 'h-[calc(100vh-100px)]' : 'lg:min-h-[600px] lg:h-[calc(100vh-180px)] h-[80vh] lg:h-auto'}`}>
        
        {/* Left: Info Side */}
        <div 
          id="book-info-panel"
          role="tabpanel"
          aria-labelledby="tab-info"
          className={`${mobileTab === 'info' ? 'flex' : 'hidden'} lg:${isFullScreen ? 'hidden' : 'flex'} lg:w-1/3 bg-slate-50 p-6 lg:p-10 flex-col items-center border-r border-slate-100 overflow-y-auto h-full`}
        >
          <div 
            className="w-32 h-48 lg:w-48 lg:h-64 rounded-2xl shadow-2xl overflow-hidden mb-6 lg:mb-8 shrink-0 transition-transform hover:scale-105 duration-300" 
            style={!showCoverImage ? { backgroundColor: getBookCoverColor(book.ddc) } : {}}
          >
            {showCoverImage ? (
              <img 
                src={displayCoverUrl} 
                className="w-full h-full object-cover" 
                alt={book.title} 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-white flex-col gap-2 p-4 text-center">
                 <BookIcon size={48} className="opacity-50" aria-hidden="true" />
                 <span className="text-xs font-black uppercase opacity-80">{book.title}</span>
              </div>
            )}
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-800 text-center mb-2 leading-tight">{book.title}</h2>
          <p className="text-slate-500 font-bold italic mb-6 lg:mb-8 text-sm lg:text-base">{book.author}</p>
          
          {/* Mobile Read Button */}
          <button 
            onClick={() => setMobileTab('reader')}
            className="lg:hidden w-full py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-lg active:scale-95 transition-transform mb-6 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="Switch to reading mode"
          >
             <BookOpen size={20} aria-hidden="true" /> ယခုဖတ်မည်
          </button>

          <div className="w-full space-y-3 lg:space-y-4 mt-auto">
            <div className="p-4 lg:p-5 bg-white rounded-2xl lg:rounded-3xl flex justify-between items-center text-xs font-bold shadow-sm border border-slate-100">
              <span className="text-slate-400">CATEGORY</span>
              <span className="text-indigo-600 font-black">DDC {book.ddc}</span>
            </div>
            <div className="p-4 lg:p-5 bg-white rounded-2xl lg:rounded-3xl flex justify-between items-center text-xs font-bold shadow-sm border border-slate-100">
              <span className="text-slate-400">STATUS</span>
              <span className="text-emerald-500 uppercase font-black">{book.status}</span>
            </div>
            <div className="p-4 lg:p-5 bg-white rounded-2xl lg:rounded-3xl flex justify-between items-center text-xs font-bold shadow-sm border border-slate-100">
              <span className="text-slate-400">PUBLISHED</span>
              <span className="text-slate-700 font-black">{book.year || "Unknown"}</span>
            </div>
          </div>
        </div>
        
        {/* Right: PDF Viewer Side */}
        <div 
          id="book-reader-panel"
          role="tabpanel"
          aria-labelledby="tab-reader"
          className={`${mobileTab === 'reader' ? 'flex' : 'hidden'} lg:flex ${isFullScreen ? 'w-full' : 'lg:w-2/3'} bg-slate-900 p-3 lg:p-4 flex-col relative group transition-all duration-300 h-full`}
        >
          {book.pdfUrl ? (
            <div className="w-full h-full flex flex-col">
              <div 
                className="flex flex-wrap justify-between items-center mb-3 lg:mb-4 px-1 gap-2"
                role="toolbar"
                aria-label="PDF Reader Tools"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <FileText size={16} aria-hidden="true" /> 
                  <span className="hidden sm:inline">PDF Reader</span>
                  {useGoogleViewer && <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[9px]">Google View</span>}
                </div>
                
                <div className="flex items-center gap-1.5 lg:gap-2">
                   {/* Viewer Toggle */}
                   <button
                    onClick={toggleViewerMode}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-bold uppercase focus:outline-none focus:ring-2 focus:ring-white ${useGoogleViewer ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'}`}
                    title={useGoogleViewer ? "Switch to Native Viewer" : "Switch to Google Viewer"}
                    aria-label={useGoogleViewer ? "Switch to Native Viewer" : "Switch to Google Viewer"}
                    aria-pressed={useGoogleViewer}
                   >
                     {useGoogleViewer ? <Globe size={16} aria-hidden="true" /> : <Monitor size={16} aria-hidden="true" />}
                     <span className="hidden sm:inline">{useGoogleViewer ? "G-View" : "Native"}</span>
                   </button>

                   <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" aria-hidden="true"></div>

                   <button
                    onClick={handleReloadPdf}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    title="Reload PDF"
                    aria-label="Reload PDF Document"
                   >
                     <RefreshCw size={16} className={pdfLoading ? "animate-spin" : ""} aria-hidden="true" />
                   </button>
                   
                   <button 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors hidden lg:block focus:outline-none focus:ring-2 focus:ring-white"
                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                    aria-label={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                    aria-pressed={isFullScreen}
                  >
                    {isFullScreen ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
                  </button>

                  <a 
                    href={book.pdfUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg text-white transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    title="Download Original"
                    aria-label="Download original PDF"
                  >
                    <Download size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="relative grow rounded-2xl bg-white overflow-hidden shadow-2xl focus-within:ring-4 focus-within:ring-indigo-500/50">
                {pdfLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 z-10">
                    <Loader2 className="animate-spin mb-4 text-[#DB8C29]" size={48} aria-hidden="true" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-60">Loading Document...</p>
                    {isDriveLink && !useGoogleViewer && (
                      <p className="text-[10px] mt-2 text-slate-400 opacity-50">Opening Google Drive Preview...</p>
                    )}
                  </div>
                )}
                <iframe 
                  key={iframeKey}
                  src={getViewerUrl()} 
                  className="w-full h-full border-none bg-slate-100" 
                  title={`PDF Reader for ${book.title}`}
                  aria-label="PDF Document Content"
                  tabIndex={0}
                  allow="autoplay"
                  onLoad={() => setPdfLoading(false)}
                />
              </div>
            </div>
          ) : (
            <div className="m-auto text-center text-white opacity-40 space-y-4 py-20 animate-pulse">
              <FileText size={100} className="mx-auto" aria-hidden="true" />
              <p className="text-xl font-bold">PDF ဖိုင်တင်ထားခြင်း မရှိသေးပါ</p>
              <p className="text-sm">ဤစာအုပ်အတွက် PDF ဖတ်ရှုနိုင်သော Link မရှိသေးပါ။</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;