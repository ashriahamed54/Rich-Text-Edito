
import React, { useState, useRef } from 'react';
import { Undo, Redo, Link, Upload, Code, Table, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setFontFamily } from '../store/editorSlice';
import FormatButtons from './toolbar/FormatButtons';
import AlignmentButtons from './toolbar/AlignmentButtons';
import ListButtons from './toolbar/ListButtons';
import ColorTools from './toolbar/ColorTools';
import ImportModal from './ImportModal';
import LinkDialog from './LinkDialog';
import TableDialog from './TableDialog';
import TemplateDialog from './TemplateDialog';
import DOMPurify from 'dompurify';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand }) => {
  const dispatch = useAppDispatch();
  const { fontFamily } = useAppSelector((state) => state.editor);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const linkSelectionRef = useRef<Range | null>(null);

  const handleHeading = (level: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (level === '') {
      document.execCommand('formatBlock', false, 'div');
    } else {
      document.execCommand('formatBlock', false, `h${level}`);
    }
    
    setTimeout(() => {
      const editorElement = document.querySelector('.rich-text-editor');
      if (editorElement) {
        const event = new Event('input', { bubbles: true });
        editorElement.dispatchEvent(event);
      }
    }, 10);
  };

  const handleFontSize = (size: string) => {
    onCommand('fontSize', size);
  };

  const handleFontFamily = (font: string) => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      // Apply font to selected text only
      onCommand('fontName', font);
    } else {
      // Set default font for new text
      dispatch(setFontFamily(font));
    }
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    if (editorElement) {
      if (!showPreview) {
        const htmlContent = editorElement.innerHTML;
        editorElement.style.whiteSpace = 'pre-wrap';
        editorElement.style.fontFamily = 'monospace';
        editorElement.textContent = htmlContent;
      } else {
        const htmlContent = editorElement.textContent || '';
        editorElement.style.whiteSpace = '';
        editorElement.style.fontFamily = fontFamily;
        editorElement.innerHTML = htmlContent;
      }
    }
  };

  const insertAtCursor = (html: string) => {
    console.log('Inserting content at cursor:', html);
    
    const selection = window.getSelection();
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    
    if (!editorElement) {
      console.error('Editor element not found');
      return;
    }

    // Sanitize the HTML content
    const sanitizedHtml = DOMPurify.sanitize(html);
    console.log('Sanitized HTML:', sanitizedHtml);

    // Focus the editor first
    editorElement.focus();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedHtml;
      
      // Insert each child node
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      
      range.insertNode(fragment);
      
      // Move cursor to end of inserted content
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If no selection, append to end
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedHtml;
      while (tempDiv.firstChild) {
        editorElement.appendChild(tempDiv.firstChild);
      }
    }
    
    // Trigger content change event
    setTimeout(() => {
      const event = new Event('input', { bubbles: true });
      editorElement.dispatchEvent(event);
    }, 10);
  };

  // Only handle hyperlink insertion through LinkDialog
  const handleLinkInsert = (linkData: any) => {
    // Restore the saved selection
    const editorElement = document.querySelector('.rich-text-editor') as HTMLElement;
    if (linkSelectionRef.current && editorElement) {
      const selection = window.getSelection();
      editorElement.focus();
      selection?.removeAllRanges();
      selection?.addRange(linkSelectionRef.current);
      document.execCommand('createLink', false, linkData.url);
      setTimeout(() => {
        const links = editorElement.querySelectorAll('a[href]');
        links.forEach(link => {
          const anchor = link as HTMLAnchorElement;
          if (anchor.getAttribute('href') === linkData.url && anchor.textContent === linkSelectionRef.current?.toString()) {
            if (linkData.openInNewTab) {
              anchor.setAttribute('target', '_blank');
              anchor.setAttribute('rel', 'noopener noreferrer');
            } else {
              anchor.removeAttribute('target');
              anchor.removeAttribute('rel');
            }
            anchor.style.color = '#2563eb';
            anchor.style.textDecoration = 'underline';
            if (linkData.title) {
              anchor.setAttribute('title', linkData.title);
            }
          }
        });
        const event = new Event('input', { bubbles: true });
        editorElement.dispatchEvent(event);
      }, 10);
    }
    // No else needed: dialog disables submit if no text is selected
  };

  // When opening the LinkDialog, save the current selection
  const handleShowLinkDialog = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      linkSelectionRef.current = selection.getRangeAt(0).cloneRange();
    } else {
      linkSelectionRef.current = null;
    }
    setShowLinkDialog(true);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-300 px-2 sm:px-4 py-3 shadow-sm">
        {/* First Row - Main formatting tools */}
        <div className="flex flex-wrap items-center justify-between w-full gap-2 sm:gap-4 mb-3">
          {/* Left Section - Headings and Font */}
          <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[90px] sm:min-w-[110px]"
              defaultValue=""
            >
              <option value="">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>

            <select
              value={fontFamily}
              onChange={(e) => handleFontFamily(e.target.value)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[100px] sm:min-w-[130px]"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
            </select>

            <select
              onChange={(e) => handleFontSize(e.target.value)}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[60px] sm:min-w-[70px]"
              defaultValue="3"
            >
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3">12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>
          </div>

          {/* Center Section - Format Tools */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <FormatButtons onCommand={onCommand} />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            
            <ColorTools onCommand={onCommand} />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            
            <ListButtons onCommand={onCommand} />
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
            <button
              onClick={handleShowLinkDialog}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Link"
              type="button"
            >
              <Link size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowTableDialog(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Table"
              type="button"
            >
              <Table size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => setShowTemplateDialog(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Insert Template"
              type="button"
            >
              <FileText size={14} className="text-gray-700" />
            </button>

            <button
              onClick={handlePreviewToggle}
              className={`h-8 w-8 flex items-center justify-center rounded transition-colors border border-transparent hover:border-gray-300 ${
                showPreview ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Toggle HTML Preview"
              type="button"
            >
              <Code size={14} />
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Import Document"
              type="button"
            >
              <Upload size={14} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Second Row - Alignment and Undo/Redo */}
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => onCommand('undo')}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Undo (Ctrl+Z)"
              type="button"
            >
              <Undo size={14} className="text-gray-700" />
            </button>

            <button
              onClick={() => onCommand('redo')}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
              title="Redo (Ctrl+Y)"
              type="button"
            >
              <Redo size={14} className="text-gray-700" />
            </button>

            <div className="h-5 w-px bg-gray-300 hidden sm:block" />

            <AlignmentButtons onCommand={onCommand} />
          </div>
        </div>
      </div>

      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onInsert={handleLinkInsert}
      />

      <TableDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onInsert={(tableData) => {
          console.log('Table data received:', tableData);
          
          let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 15px 0; font-size: 14px;">';
          
          if (tableData.hasHeader) {
            tableHtml += '<thead><tr>';
            for (let i = 0; i < tableData.cols; i++) {
              tableHtml += `<th style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; background-color: #f8f9fa; font-weight: bold;">Header ${i + 1}</th>`;
            }
            tableHtml += '</tr></thead>';
          }
          
          tableHtml += '<tbody>';
          const startRow = tableData.hasHeader ? 1 : 0;
          for (let i = startRow; i < tableData.rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < tableData.cols; j++) {
              tableHtml += `<td style="border: 1px solid #ddd; padding: 12px 8px; text-align: left;">Cell ${i + 1}-${j + 1}</td>`;
            }
            tableHtml += '</tr>';
          }
          tableHtml += '</tbody></table><p><br></p>';
          
          console.log('Generated table HTML:', tableHtml);
          insertAtCursor(tableHtml);
        }}
      />

      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onInsert={(templateContent) => {
          console.log('Template content received:', templateContent);
          insertAtCursor(templateContent);
        }}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(content) => {
          const sanitizedContent = DOMPurify.sanitize(content);
          insertAtCursor(sanitizedContent);
        }}
      />
    </>
  );
};

export default EditorToolbar;
