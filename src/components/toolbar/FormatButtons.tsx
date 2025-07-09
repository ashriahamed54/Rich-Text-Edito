
import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

interface FormatButtonsProps {
  onCommand: (command: string, value?: string) => void;
}

const FormatButtons: React.FC<FormatButtonsProps> = ({ onCommand }) => {
  const formatButtons = [
    { command: 'bold', icon: Bold, label: 'Bold (Ctrl+B)' },
    { command: 'italic', icon: Italic, label: 'Italic (Ctrl+I)' },
    { command: 'underline', icon: Underline, label: 'Underline (Ctrl+U)' },
  ];

  return (
    <div className="flex items-center gap-1">
      {formatButtons.map(({ command, icon: Icon, label }) => (
        <button
          key={command}
          onClick={() => onCommand(command)}
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
          title={label}
          type="button"
        >
          <Icon size={14} className="text-gray-700" />
        </button>
      ))}
    </div>
  );
};

export default FormatButtons;
