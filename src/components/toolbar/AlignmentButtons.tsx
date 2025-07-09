
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface AlignmentButtonsProps {
  onCommand: (command: string, value?: string) => void;
}

const AlignmentButtons: React.FC<AlignmentButtonsProps> = ({ onCommand }) => {
  const alignmentButtons = [
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
    { command: 'justifyFull', icon: AlignJustify, label: 'Justify' },
  ];

  return (
    <div className="flex items-center gap-1">
      {alignmentButtons.map(({ command, icon: Icon, label }) => (
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

export default AlignmentButtons;
