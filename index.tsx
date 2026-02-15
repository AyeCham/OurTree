import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <--- ADD THIS LINE
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);