
import React from 'react';
import { List, ListOrdered } from 'lucide-react';

interface ListButtonsProps {
  onCommand: (command: string, value?: string) => void;
}

const ListButtons: React.FC<ListButtonsProps> = ({ onCommand }) => {
  const handleBulletList = (type: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Apply bullet list first
    document.execCommand('insertUnorderedList', false);
    
    // Apply custom styling based on type
    setTimeout(() => {
      const lists = document.querySelectorAll('ul');
      const range = selection.getRangeAt(0);
      
      lists.forEach(ul => {
        if (ul.contains(range.commonAncestorContainer) || 
            range.commonAncestorContainer.contains(ul) ||
            range.intersectsNode(ul)) {
          switch (type) {
            case 'disc':
              ul.style.listStyleType = 'disc';
              break;
            case 'circle':
              ul.style.listStyleType = 'circle';
              break;
            case 'square':
              ul.style.listStyleType = 'square';
              break;
            case 'arrow':
              ul.style.listStyleType = 'none';
              ul.querySelectorAll('li').forEach(li => {
                li.style.position = 'relative';
                li.style.paddingLeft = '20px';
                li.setAttribute('data-bullet', '→');
              });
              break;
            case 'check':
              ul.style.listStyleType = 'none';
              ul.querySelectorAll('li').forEach(li => {
                li.style.position = 'relative';
                li.style.paddingLeft = '20px';
                li.setAttribute('data-bullet', '✓');
              });
              break;
          }
        }
      });
    }, 50);
  };

  const handleNumberedList = (type: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Apply numbered list first
    document.execCommand('insertOrderedList', false);
    
    // Apply custom styling based on type
    setTimeout(() => {
      const lists = document.querySelectorAll('ol');
      const range = selection.getRangeAt(0);
      
      lists.forEach(ol => {
        if (ol.contains(range.commonAncestorContainer) || 
            range.commonAncestorContainer.contains(ol) ||
            range.intersectsNode(ol)) {
          switch (type) {
            case 'decimal':
              ol.style.listStyleType = 'decimal';
              break;
            case 'lower-alpha':
              ol.style.listStyleType = 'lower-alpha';
              break;
            case 'upper-alpha':
              ol.style.listStyleType = 'upper-alpha';
              break;
            case 'lower-roman':
              ol.style.listStyleType = 'lower-roman';
              break;
            case 'upper-roman':
              ol.style.listStyleType = 'upper-roman';
              break;
          }
        }
      });
    }, 50);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative group">
        <button
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
          title="Bullet List Options"
        >
          <List size={14} className="text-gray-700" />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
          <button
            onClick={() => handleBulletList('disc')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>•</span> Disc
          </button>
          <button
            onClick={() => handleBulletList('circle')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>◦</span> Circle
          </button>
          <button
            onClick={() => handleBulletList('square')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>▪</span> Square
          </button>
          <button
            onClick={() => handleBulletList('arrow')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>→</span> Arrow
          </button>
          <button
            onClick={() => handleBulletList('check')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>✓</span> Check
          </button>
        </div>
      </div>

      <div className="relative group">
        <button
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
          title="Numbered List Options"
        >
          <ListOrdered size={14} className="text-gray-700" />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
          <button
            onClick={() => handleNumberedList('decimal')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>1.</span> Numbers
          </button>
          <button
            onClick={() => handleNumberedList('lower-alpha')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>a.</span> Lowercase
          </button>
          <button
            onClick={() => handleNumberedList('upper-alpha')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>A.</span> Uppercase
          </button>
          <button
            onClick={() => handleNumberedList('lower-roman')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>i.</span> Roman Lower
          </button>
          <button
            onClick={() => handleNumberedList('upper-roman')}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>I.</span> Roman Upper
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListButtons;
