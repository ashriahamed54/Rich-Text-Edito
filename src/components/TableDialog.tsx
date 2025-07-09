
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (tableData: {
    rows: number;
    cols: number;
    hasHeader: boolean;
  }) => void;
}

const TableDialog: React.FC<TableDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInsert({ rows, cols, hasHeader });
    onClose();
  };

  const handleClose = () => {
    setRows(3);
    setCols(3);
    setHasHeader(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Insert Table</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">
                Rows
              </label>
              <input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="cols" className="block text-sm font-medium text-gray-700 mb-1">
                Columns
              </label>
              <input
                id="cols"
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="hasHeader"
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasHeader" className="text-sm text-gray-700">
              Include header row
            </label>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <div className="text-xs text-gray-500">
              Table with {rows} rows × {cols} columns
              {hasHeader && ' (with header)'}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
            >
              Insert Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableDialog;
