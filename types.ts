export interface Book {
  id: number;
  title: string;
  author: string;
  ddc: string;
  isFeatured: boolean;
  status: string;
  year: string;
  coverUrl: string;
  pdfUrl: string;
}

export interface BookRequest {
  id: number;
  title: string;
  author: string;
  requester: string;
  date: string;
}

export interface DDCCategory {
  code: string;
  label: string;
  iconName: string; // Storing the icon name to map to Lucide icons
  color: string;
}

export type Tab = "home" | "browse" | "list" | "requests" | "admin_dashboard";

export interface LoginForm {
  username: string;
  password: string;
}

export interface NewBookForm {
  title: string;
  author: string;
  ddc: string;
  isFeatured: boolean;
  year: string;
  coverUrl: string;
  pdfUrl: string;
}

export interface NewRequestForm {
  title: string;
  author: string;
  requester: string;
}