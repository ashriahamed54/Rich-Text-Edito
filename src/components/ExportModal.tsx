
import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, content }) => {
  const [exportFormat, setExportFormat] = useState<'html' | 'markdown' | 'pdf'>('html');

  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Document</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    // Basic HTML to Markdown conversion
    let markdown = content
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1')
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Basic PDF export using browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Document</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                img { max-width: 100%; height: auto; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'html':
        exportToHTML();
        break;
      case 'markdown':
        exportToMarkdown();
        break;
      case 'pdf':
        exportToPDF();
        break;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Export Document</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'html' | 'markdown' | 'pdf')}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="html">HTML</option>
            <option value="markdown">Markdown</option>
            <option value="pdf">PDF (Print)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
