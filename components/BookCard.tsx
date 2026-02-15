import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Book } from '../types';
import { COLORS, DDC_CATEGORIES } from '../constants';

interface BookCardProps {
  book: Book;
  isAdmin: boolean;
  onClick: (book: Book) => void;
  onDelete: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isAdmin, onClick, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [book.coverUrl]);

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
          return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w600`;
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('ဖျက်ရန် သေချာပါသလား?')) {
      onDelete(book.id);
    }
  };

  const displayUrl = getProcessedCoverUrl(book.coverUrl);
  const showCoverImage = book.coverUrl && !imgError;

  return (
    <div className="flex flex-col items-center group cursor-pointer" onClick={() => onClick(book)}>
      <div 
        className="relative w-32 h-44 sm:w-40 sm:h-56 rounded-r-lg shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl overflow-hidden" 
        style={{ backgroundColor: showCoverImage ? 'white' : getBookCoverColor(book.ddc) }}
      >
        {!showCoverImage && <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 z-10"></div>}
        
        {showCoverImage ? (
          <img 
            src={displayUrl} 
            alt={book.title} 
            className="w-full h-full object-cover" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="p-3 h-full flex flex-col justify-between text-white relative z-0">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-black bg-white/20 px-1 rounded uppercase tracking-tighter">
                DDC {book.ddc}
              </span>
              {book.isFeatured && <Star size={10} className="fill-white" />}
            </div>
            <div className="my-auto">
              <h4 className="text-[11px] sm:text-xs font-black leading-tight line-clamp-4 text-center border-y border-white/30 py-2">
                {book.title}
              </h4>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-medium opacity-80 truncate">{book.author}</p>
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
      </div>
      
      <div className="mt-3 text-center px-2">
        <h5 className="text-[11px] font-black text-slate-800 line-clamp-1 w-32 sm:w-40">{book.title}</h5>
        <div className="flex items-center justify-center gap-1 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span className={`w-1.5 h-1.5 rounded-full ${book.status === "ရရှိနိုင်သည်" ? "bg-emerald-500" : "bg-red-500"}`}></span>
          {book.status}
        </div>
      </div>

      {isAdmin && (
        <button 
          onClick={handleDelete} 
          className="mt-2 p-1.5 bg-red-50 text-red-400 rounded-full hover:bg-red-100 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};

export default BookCard;