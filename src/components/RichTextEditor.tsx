
import React, { useRef, useCallback, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setContent } from '../store/editorSlice';
import EditorToolbar from './EditorToolbar';
import DOMPurify from 'dompurify';

const RichTextEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { content, fontFamily } = useAppSelector((state) => state.editor);
  const editorRef = useRef<HTMLDivElement>(null);

  // Custom undo/redo stacks for table operations
  const tableUndoStack = useRef<string[]>([]);
  const tableRedoStack = useRef<string[]>([]);
  const lastTableEdit = useRef<boolean>(false);

  const saveTableUndoState = () => {
    if (editorRef.current) {
      tableUndoStack.current.push(editorRef.current.innerHTML);
      // Clear redo stack on new action
      tableRedoStack.current = [];
      lastTableEdit.current = true;
    }
  };

  const restoreTableUndoState = () => {
    if (tableUndoStack.current.length > 0 && editorRef.current) {
      const prev = tableUndoStack.current.pop();
      if (prev !== undefined) {
        tableRedoStack.current.push(editorRef.current.innerHTML);
        editorRef.current.innerHTML = prev;
        handleContentChange();
      }
    }
  };

  const restoreTableRedoState = () => {
    if (tableRedoStack.current.length > 0 && editorRef.current) {
      const next = tableRedoStack.current.pop();
      if (next !== undefined) {
        tableUndoStack.current.push(editorRef.current.innerHTML);
        editorRef.current.innerHTML = next;
        handleContentChange();
      }
    }
  };

  const executeCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (command === 'undo') {
      if (lastTableEdit.current && tableUndoStack.current.length > 0) {
        restoreTableUndoState();
        lastTableEdit.current = false;
        return;
      }
    } else if (command === 'redo') {
      if (tableRedoStack.current.length > 0) {
        restoreTableRedoState();
        return;
      }
    }
    document.execCommand(command, false, value);
    // Do NOT update Redux here!
  }, []);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML);
      dispatch(setContent(sanitizedContent));
    }
  }, [dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          if (!e.shiftKey) {
            e.preventDefault();
            executeCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
          break;
      }
    }
  }, [executeCommand]);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      const sanitizedContent = DOMPurify.sanitize(content);
      editorRef.current.innerHTML = sanitizedContent;
    }
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    function handleLinkClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) {
          window.open((target as HTMLAnchorElement).href, '_blank', 'noopener');
        }
        e.preventDefault(); // Always prevent default navigation in edit mode
      }
    }
    editor.addEventListener('click', handleLinkClick);
    return () => {
      editor.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML.trim() === '') {
      editor.innerHTML = '<p>Start typing your content here...</p>';
    }

    const style = document.createElement('style');
    style.textContent = `
      .rich-text-editor ul {
        list-style-position: outside;
        padding-left: 30px;
        margin: 10px 0;
      }
      .rich-text-editor ol {
        list-style-position: outside;
        padding-left: 30px;
        margin: 10px 0;
      }
      .rich-text-editor li {
        margin: 5px 0;
        line-height: 1.5;
      }
      .rich-text-editor ul ul {
        list-style-type: circle;
        margin: 5px 0;
        padding-left: 25px;
      }
      .rich-text-editor ol ol {
        list-style-type: lower-alpha;
        margin: 5px 0;
        padding-left: 25px;
      }
      .rich-text-editor h1 {
        font-size: 2.25em;
        font-weight: bold;
        margin: 20px 0 16px 0;
        line-height: 1.2;
        color: #1F2937;
      }
      .rich-text-editor h2 {
        font-size: 1.875em;
        font-weight: bold;
        margin: 18px 0 14px 0;
        line-height: 1.3;
        color: #1F2937;
      }
      .rich-text-editor h3 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 16px 0 12px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor h4 {
        font-size: 1.25em;
        font-weight: bold;
        margin: 14px 0 10px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor h5 {
        font-size: 1.125em;
        font-weight: bold;
        margin: 12px 0 8px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor h6 {
        font-size: 1em;
        font-weight: bold;
        margin: 10px 0 6px 0;
        line-height: 1.4;
        color: #1F2937;
      }
      .rich-text-editor p {
        margin: 10px 0;
        line-height: 1.6;
      }
      .rich-text-editor a {
        color: #2563eb;
        text-decoration: underline;
        transition: color 0.2s;
        cursor: pointer;
      }
      .rich-text-editor a:hover {
        color: #1d4ed8;
      }
      .rich-text-editor table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 15px 0 !important;
        font-size: 14px !important;
        display: table !important;
        table-layout: auto !important;
      }
      .rich-text-editor th,
      .rich-text-editor td {
        border: 1px solid #ddd !important;
        padding: 12px 8px !important;
        text-align: left !important;
        vertical-align: top !important;
        word-wrap: break-word !important;
      }
      .rich-text-editor th {
        background-color: #f8f9fa !important;
        font-weight: bold !important;
      }
      .rich-text-editor tbody tr:nth-child(even) {
        background-color: #f9f9f9 !important;
      }
      .rich-text-editor tbody tr:hover {
        background-color: #f5f5f5 !important;
      }
      .rich-text-editor thead tr {
        background-color: #f8f9fa !important;
      }
      .rich-text-editor blockquote {
        border-left: 4px solid #E5E7EB;
        margin: 16px 0;
        padding-left: 16px;
        font-style: italic;
        color: #6B7280;
      }
      .rich-text-editor code {
        background-color: #F3F4F6;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }
      .rich-text-editor pre {
        background-color: #F3F4F6;
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 12px 0;
      }
      .rich-text-editor li[data-bullet] {
        position: relative;
        list-style-type: none !important;
        padding-left: 1.5em;
      }
      .rich-text-editor li[data-bullet]::before {
        content: attr(data-bullet);
        position: absolute;
        left: 0;
        top: 0.1em;
        font-size: 1em;
        color: #22c55e;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Helper to ensure all table cells are editable
  const ensureAllCellsEditable = () => {
    if (editorRef.current) {
      const cells = editorRef.current.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'true');
      });
    }
  };

  const addTableRow = (table: HTMLElement, cell: HTMLElement) => {
    saveTableUndoState();
    // Find the row to clone
    const row = cell.closest('tr');
    if (row) {
      const isHeader = row.querySelectorAll('th').length > 0;
      const cellTag = isHeader ? 'th' : 'td';
      const numCells = row.children.length;
      const newRow = document.createElement('tr');
      for (let i = 0; i < numCells; i++) {
        const newCell = document.createElement(cellTag);
        newCell.setAttribute('contenteditable', 'true');
        newCell.textContent = isHeader ? `Header` : `Cell`;
        newRow.appendChild(newCell);
      }
      row.parentNode?.insertBefore(newRow, row.nextSibling);
      ensureAllCellsEditable();
      handleContentChange();
    }
  };

  const addTableColumn = (table: HTMLElement, cell: HTMLElement) => {
    saveTableUndoState();
    // Find the column index
    const cellIndex = Array.from(cell.parentNode!.children).indexOf(cell);
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const isHeader = row.querySelectorAll('th').length > 0;
      const cellTag = isHeader ? 'th' : 'td';
      const newCell = document.createElement(cellTag);
      newCell.setAttribute('contenteditable', 'true');
      newCell.textContent = isHeader ? `Header` : `Cell`;
      // Insert after the current cell index
      if (row.children[cellIndex]) {
        row.insertBefore(newCell, row.children[cellIndex + 1]);
      } else {
        row.appendChild(newCell);
      }
    });
    ensureAllCellsEditable();
    handleContentChange();
  };

  const deleteTableRow = (table: HTMLElement, cell: HTMLElement) => {
    saveTableUndoState();
    const rowIndex = Array.from(cell.parentNode!.children).indexOf(cell);
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      rows[rowIndex].remove();
      ensureAllCellsEditable();
      handleContentChange();
    }
  };

  const deleteTableColumn = (table: HTMLElement, cell: HTMLElement) => {
    saveTableUndoState();
    const cellIndex = Array.from(cell.parentNode!.children).indexOf(cell);
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0 && rows[0].children.length > 1) {
      rows.forEach(row => {
        if (row.children[cellIndex]) {
          row.children[cellIndex].remove();
        }
      });
      ensureAllCellsEditable();
      handleContentChange();
    }
  };

  const addTableRowAbove = (table: HTMLElement, cell: HTMLElement) => {
    saveTableUndoState();
    const row = cell.closest('tr');
    if (row) {
      const isHeader = row.querySelectorAll('th').length > 0;
      const cellTag = isHeader ? 'th' : 'td';
      const numCells = row.children.length;
      const newRow = document.createElement('tr');
      for (let i = 0; i < numCells; i++) {
        const newCell = document.createElement(cellTag);
        newCell.setAttribute('contenteditable', 'true');
        newCell.textContent = isHeader ? `Header` : `Cell`;
        newRow.appendChild(newCell);
      }
      row.parentNode?.insertBefore(newRow, row);
      ensureAllCellsEditable();
      handleContentChange();
    }
  };

  const addTableColumnLeft = (table: HTMLElement, cell: HTMLElement) => {
    saveTableUndoState();
    const cellIndex = Array.from(cell.parentNode!.children).indexOf(cell);
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const isHeader = row.querySelectorAll('th').length > 0;
      const cellTag = isHeader ? 'th' : 'td';
      const newCell = document.createElement(cellTag);
      newCell.setAttribute('contenteditable', 'true');
      newCell.textContent = isHeader ? `Header` : `Cell`;
      row.insertBefore(newCell, row.children[cellIndex]);
    });
    ensureAllCellsEditable();
    handleContentChange();
  };

  // Enhanced context menu for table cells
  const showTableContextMenu = (e: MouseEvent, cell: HTMLElement, table: HTMLElement) => {
    // Remove any existing custom context menu
    const existingMenu = document.getElementById('custom-table-context-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'custom-table-context-menu';
    menu.className = 'fixed bg-white border border-gray-300 rounded shadow-lg z-50 p-2';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    menu.style.minWidth = '160px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';

    const addRowButton = document.createElement('button');
    addRowButton.textContent = 'Add Row Below';
    addRowButton.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm';
    addRowButton.onclick = () => {
      addTableRow(table, cell);
      menu.remove();
    };

    const addColButton = document.createElement('button');
    addColButton.textContent = 'Add Column Right';
    addColButton.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm';
    addColButton.onclick = () => {
      addTableColumn(table, cell);
      menu.remove();
    };

    const deleteRowButton = document.createElement('button');
    deleteRowButton.textContent = 'Delete Row';
    deleteRowButton.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600';
    deleteRowButton.onclick = () => {
      deleteTableRow(table, cell);
      menu.remove();
    };

    const deleteColButton = document.createElement('button');
    deleteColButton.textContent = 'Delete Column';
    deleteColButton.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600';
    deleteColButton.onclick = () => {
      deleteTableColumn(table, cell);
      menu.remove();
    };

    const addRowAboveButton = document.createElement('button');
    addRowAboveButton.textContent = 'Add Row Above';
    addRowAboveButton.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm';
    addRowAboveButton.onclick = () => {
      addTableRowAbove(table, cell);
      menu.remove();
    };

    const addColLeftButton = document.createElement('button');
    addColLeftButton.textContent = 'Add Column Left';
    addColLeftButton.className = 'block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm';
    addColLeftButton.onclick = () => {
      addTableColumnLeft(table, cell);
      menu.remove();
    };

    menu.appendChild(addRowAboveButton);
    menu.appendChild(addRowButton);
    menu.appendChild(addColLeftButton);
    menu.appendChild(addColButton);
    menu.appendChild(deleteRowButton);
    menu.appendChild(deleteColButton);

    document.body.appendChild(menu);

    // Remove menu when clicking elsewhere
    const removeMenu = () => {
      if (document.body.contains(menu)) {
        menu.remove();
      }
      document.removeEventListener('click', removeMenu);
    };
    setTimeout(() => document.addEventListener('click', removeMenu), 0);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Handler for table cell right-click
    function handleCellContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'TD' || target.tagName === 'TH') {
        e.preventDefault();
        const table = target.closest('table');
        if (table) {
          showTableContextMenu(e, target, table as HTMLElement);
        }
      }
    }

    // Attach to all table cells
    const attachContextMenu = () => {
      const cells = editor.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.removeEventListener('contextmenu', handleCellContextMenu);
        cell.addEventListener('contextmenu', handleCellContextMenu);
      });
    };

    attachContextMenu();

    // Re-attach after every content change
    const observer = new MutationObserver(attachContextMenu);
    observer.observe(editor, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const cells = editor.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.removeEventListener('contextmenu', handleCellContextMenu);
      });
    };
  }, [content]);

  return (
    <div className="w-full max-w-5xl mx-auto border border-gray-300 rounded-lg bg-white shadow-sm">
      <EditorToolbar onCommand={executeCommand} onBeforeInsertContent={saveTableUndoState} />
      <div
        ref={editorRef}
        contentEditable
        className="rich-text-editor p-4 sm:p-6 min-h-96 max-h-screen overflow-y-auto outline-none text-gray-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ fontFamily }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
