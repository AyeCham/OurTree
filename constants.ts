import { Book, DDCCategory } from "./types";

export const STORAGE_KEY = "our_trees_library_final_v1";
export const REQUEST_STORAGE_KEY = "our_trees_library_requests_final";
export const DATA_VERSION = "1.0.2"; // Increment this when deploying new books to force client-side sync
export const VERSION_KEY = "our_trees_db_version";

// For Offline usage, place these images in public/logo/ folder
export const SPLASH_LOGO_URL = "/logo/Our_Trees_Education_Foundation_rgb-02.jpg"; 
export const HEADER_LOGO_URL = "/logo/Our_Trees_Education_Foundation_rgb-02.jpg";
// Audio can be placed in public/audio/
export const INTRO_AUDIO_URL = "/audio/intro.mp3"; 

export const COLORS = {
  primary: "#DB8C29",
  secondary: "#BFC8A1",
  bgLight: "#F1F4EE"
};

export const DDC_CATEGORIES: DDCCategory[] = [
  { code: "000", label: "အထွေထွေဗဟုသုတ", iconName: "book", color: "#4A90E2" },
  { code: "100", label: "စိတ်ပညာနှင့် ဒဿန", iconName: "brain", color: "#9B59B6" },
  { code: "200", label: "ဘာသာရေး", iconName: "sun", color: "#F1C40F" },
  { code: "300", label: "လူမှုရေးသိပ္ပံ", iconName: "users", color: "#E67E22" },
  { code: "400", label: "ဘာသာစကား", iconName: "message-square", color: "#1ABC9C" },
  { code: "500", label: "သဘာဝသိပ္ပံ", iconName: "microscope", color: "#2ECC71" },
  { code: "600", label: "နည်းပညာ", iconName: "settings", color: "#34495E" },
  { code: "700", label: "အနုပညာ", iconName: "palette", color: "#E74C3C" },
  { code: "800", label: "စာပေ", iconName: "pen-tool", color: "#DB8C29" },
  { code: "900", label: "သမိုင်းနှင့် ပထဝီ", iconName: "map", color: "#7F8C8D" }
];

// NOTE: Ensure your PDF files are in 'public/books/' and Covers in 'public/covers/'
export const SAMPLE_BOOKS: Book[] = [
  { 
    id: 1, 
    title: "API Book", 
    author: "Ei Maung", 
    ddc: "000", 
    isFeatured: true, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/API-book-by-Ei-Maung.pdf" 
  },
  { 
    id: 2, 
    title: "Bitcoin Book", 
    author: "Ei Maung", 
    ddc: "300", 
    isFeatured: false, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/Bitcoin-book-by-Ei-Maung.pdf" 
  },
  { 
    id: 3, 
    title: "Bootstrap 5 Book", 
    author: "Ei Maung", 
    ddc: "600", 
    isFeatured: true, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/Bootstrap5-book-by-Ei-Maung.pdf" 
  },
  { 
    id: 4, 
    title: "JavaScript Book", 
    author: "Ei Maung", 
    ddc: "600", 
    isFeatured: true, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/JavaScript-Book-by-Ei-Maung.pdf" 
  },
  { 
    id: 5, 
    title: "Laravel 8 Book", 
    author: "Ei Maung", 
    ddc: "600", 
    isFeatured: false, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/Laravel8-book-by-Ei-Maung.pdf" 
  },
  { 
    id: 6, 
    title: "Professional Web Developer", 
    author: "Ei Maung", 
    ddc: "600", 
    isFeatured: true, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/Professional-Web-Developer-2023.pdf" 
  },
  { 
    id: 7, 
    title: "React Book", 
    author: "Ei Maung", 
    ddc: "600", 
    isFeatured: true, 
    status: "ရရှိနိုင်သည်", 
    year: "၂၀၂၃", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/React-book-by-Ei-Maung.pdf" 
  },
  { 
    id: 8, 
    title: "Lyra and Silent Frequency", 
    author: "Unknown", 
    ddc: "800", 
    isFeatured: false, 
    status: "ရရှိနိုင်သည်", 
    year: "2023", 
    coverUrl: "/covers/default_cover.jpg", 
    pdfUrl: "/books/Lyra-and-Silent-Frequency.pdf" 
  }
];