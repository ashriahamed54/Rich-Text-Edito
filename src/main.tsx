import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { EditorContentProvider } from './context/EditorContentContext';

createRoot(document.getElementById("root")!).render(
  <EditorContentProvider>
    <App />
  </EditorContentProvider>
);
