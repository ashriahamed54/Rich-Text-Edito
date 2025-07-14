import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
export type EditorContentContextType = {
  content: string;
  setContent: (content: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
};

const EditorContentContext = createContext<EditorContentContextType | undefined>(undefined);

export const EditorContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("");

  return (
    <EditorContentContext.Provider value={{ content, setContent, fontFamily, setFontFamily }}>
      {children}
    </EditorContentContext.Provider>
  );
};

export const useEditorContent = () => {
  const context = useContext(EditorContentContext);
  if (!context) throw new Error("useEditorContent must be used within EditorContentProvider");
  return context;
}; 