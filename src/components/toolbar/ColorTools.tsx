
import React, { useState } from 'react';
import { Type, Highlighter } from 'lucide-react';

interface ColorToolsProps {
  onCommand: (command: string, value?: string) => void;
}

const ColorTools: React.FC<ColorToolsProps> = ({ onCommand }) => {
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  const handleTextColor = (color: string) => {
    setTextColor(color);
    onCommand('foreColor', color);
  };

  const handleBackgroundColor = (color: string) => {
    setHighlightColor(color);
    onCommand('hiliteColor', color);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          className="h-8 w-10 flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
          title="Text Color"
        >
          <Type size={14} className="text-gray-700" />
          <div className="w-6 h-1 mt-0.5 rounded" style={{ backgroundColor: textColor }}></div>
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleTextColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </button>
      </div>

      <div className="relative">
        <button
          className="h-8 w-10 flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
          title="Highlight Color"
        >
          <Highlighter size={14} className="text-gray-700" />
          <div className="w-6 h-1 mt-0.5 rounded" style={{ backgroundColor: highlightColor }}></div>
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => handleBackgroundColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
};

export default ColorTools;
